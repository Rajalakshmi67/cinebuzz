import axios from 'axios';
import { TVShow } from '@/utils/tvShowData';

const API_KEY = '2e853e239a10686485ea5d598515cf2d';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_URL = 'https://image.tmdb.org/t/p/original';

// Define interfaces for TMDB responses
interface TMDBTVShow {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  overview: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  genres?: { id: number; name: string }[];
  status?: string;
  networks?: { id: number; name: string; logo_path: string }[];
}

interface TMDBTVShowDetails extends TMDBTVShow {
  number_of_seasons: number;
  number_of_episodes: number;
  genres: { id: number; name: string }[];
  credits?: {
    cast: { id: number; name: string; character: string }[];
  };
  status: string;
  networks: { id: number; name: string; logo_path: string }[];
}

interface TMDBResponse {
  page: number;
  results: TMDBTVShow[];
  total_pages: number;
  total_results: number;
}

// Cache mechanism
const cacheData: Record<string, { data: any; timestamp: number }> = {};
const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes

// Convert TMDB TV show to our app's TVShow format
const convertToTVShow = (tmdbShow: TMDBTVShow, details?: TMDBTVShowDetails): TVShow => {
  const releaseYear = tmdbShow.first_air_date 
    ? parseInt(tmdbShow.first_air_date.split('-')[0], 10) 
    : 0;
  
  // Convert networks to platforms
  const platforms = details?.networks?.map(network => ({
    name: network.name,
    logo: network.logo_path ? `https://image.tmdb.org/t/p/w92${network.logo_path}` : '',
    url: `https://www.google.com/search?q=${encodeURIComponent(network.name)}`
  })) || [];
  
  return {
    id: tmdbShow.id,
    title: tmdbShow.name,
    posterUrl: tmdbShow.poster_path ? `${IMG_URL}${tmdbShow.poster_path}` : '',
    backdropUrl: tmdbShow.backdrop_path ? `${BACKDROP_URL}${tmdbShow.backdrop_path}` : '',
    year: releaseYear,
    rating: tmdbShow.vote_average,
    seasons: details?.number_of_seasons || 0,
    episodes: details?.number_of_episodes || 0,
    genre: details?.genres?.map(g => g.name) || [],
    cast: details?.credits?.cast?.slice(0, 5).map(actor => actor.name) || [],
    plot: tmdbShow.overview,
    status: details?.status || '',
    platforms,
    trailerUrl: ''
  };
};

// Search TV shows by query
export const searchTMDBTVShows = async (query: string, page = 1): Promise<{ shows: TVShow[]; totalPages: number }> => {
  const cacheKey = `search_tv_${query}_${page}`;
  
  if (cacheData[cacheKey] && Date.now() - cacheData[cacheKey].timestamp < CACHE_EXPIRY) {
    return cacheData[cacheKey].data;
  }
  
  try {
    const response = await axios.get<TMDBResponse>(`${BASE_URL}/search/tv`, {
      params: {
        api_key: API_KEY,
        query,
        page,
        include_adult: false,
        language: 'en-US'
      }
    });
    
    const shows = response.data.results.map(show => convertToTVShow(show));
    const result = { shows, totalPages: response.data.total_pages };
    
    cacheData[cacheKey] = { data: result, timestamp: Date.now() };
    return result;
  } catch (error) {
    console.error('Error searching TMDB TV shows:', error);
    return { shows: [], totalPages: 0 };
  }
};

// Get popular TV shows
export const getPopularTMDBTVShows = async (page = 1): Promise<TVShow[]> => {
  const cacheKey = `popular_tv_${page}`;
  
  if (cacheData[cacheKey] && Date.now() - cacheData[cacheKey].timestamp < CACHE_EXPIRY) {
    return cacheData[cacheKey].data;
  }
  
  try {
    const response = await axios.get<TMDBResponse>(`${BASE_URL}/tv/popular`, {
      params: {
        api_key: API_KEY,
        page,
        language: 'en-US'
      }
    });
    
    const shows = response.data.results.map(show => convertToTVShow(show));
    
    cacheData[cacheKey] = { data: shows, timestamp: Date.now() };
    return shows;
  } catch (error) {
    console.error('Error fetching popular TMDB TV shows:', error);
    return [];
  }
};

// Get top rated TV shows
export const getTopRatedTMDBTVShows = async (page = 1): Promise<TVShow[]> => {
  const cacheKey = `top_rated_tv_${page}`;
  
  if (cacheData[cacheKey] && Date.now() - cacheData[cacheKey].timestamp < CACHE_EXPIRY) {
    return cacheData[cacheKey].data;
  }
  
  try {
    const response = await axios.get<TMDBResponse>(`${BASE_URL}/tv/top_rated`, {
      params: {
        api_key: API_KEY,
        page,
        language: 'en-US'
      }
    });
    
    const shows = response.data.results.map(show => convertToTVShow(show));
    
    cacheData[cacheKey] = { data: shows, timestamp: Date.now() };
    return shows;
  } catch (error) {
    console.error('Error fetching top rated TMDB TV shows:', error);
    return [];
  }
};

// Get TV show details by ID
export const getTMDBTVShowById = async (tmdbId: string | number): Promise<TVShow | null> => {
  const id = typeof tmdbId === 'string' ? tmdbId.replace('tmdb_', '') : tmdbId;
  const cacheKey = `tv_${id}`;
  
  if (cacheData[cacheKey] && Date.now() - cacheData[cacheKey].timestamp < CACHE_EXPIRY) {
    return cacheData[cacheKey].data;
  }
  
  try {
    const response = await axios.get<TMDBTVShowDetails>(`${BASE_URL}/tv/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: 'credits',
        language: 'en-US'
      }
    });
    
    const show = convertToTVShow(response.data, response.data);
    
    cacheData[cacheKey] = { data: show, timestamp: Date.now() };
    return show;
  } catch (error) {
    console.error(`Error fetching TMDB TV show with id ${id}:`, error);
    return null;
  }
};

// Get airing today TV shows
export const getAiringTodayTMDBTVShows = async (page = 1): Promise<TVShow[]> => {
  const cacheKey = `airing_today_${page}`;
  
  if (cacheData[cacheKey] && Date.now() - cacheData[cacheKey].timestamp < CACHE_EXPIRY) {
    return cacheData[cacheKey].data;
  }
  
  try {
    const response = await axios.get<TMDBResponse>(`${BASE_URL}/tv/airing_today`, {
      params: {
        api_key: API_KEY,
        page,
        language: 'en-US'
      }
    });
    
    const shows = response.data.results.map(show => convertToTVShow(show));
    
    cacheData[cacheKey] = { data: shows, timestamp: Date.now() };
    return shows;
  } catch (error) {
    console.error('Error fetching airing today TMDB TV shows:', error);
    return [];
  }
};

// Get TV shows by genre
export const getTVShowsByGenre = async (genreId: number, page = 1): Promise<TVShow[]> => {
  const cacheKey = `tv_genre_${genreId}_${page}`;
  
  if (cacheData[cacheKey] && Date.now() - cacheData[cacheKey].timestamp < CACHE_EXPIRY) {
    return cacheData[cacheKey].data;
  }
  
  try {
    const response = await axios.get<TMDBResponse>(`${BASE_URL}/discover/tv`, {
      params: {
        api_key: API_KEY,
        with_genres: genreId,
        page,
        language: 'en-US',
        sort_by: 'popularity.desc'
      }
    });
    
    const shows = response.data.results.map(show => convertToTVShow(show));
    
    cacheData[cacheKey] = { data: shows, timestamp: Date.now() };
    return shows;
  } catch (error) {
    console.error(`Error fetching TMDB TV shows for genre ${genreId}:`, error);
    return [];
  }
};

// Get list of TV genres
export const getTVGenres = async (): Promise<{id: number, name: string}[]> => {
  const cacheKey = 'tv_genres';
  
  if (cacheData[cacheKey] && Date.now() - cacheData[cacheKey].timestamp < CACHE_EXPIRY) {
    return cacheData[cacheKey].data;
  }
  
  try {
    const response = await axios.get(`${BASE_URL}/genre/tv/list`, {
      params: {
        api_key: API_KEY,
        language: 'en-US'
      }
    });
    
    cacheData[cacheKey] = { data: response.data.genres, timestamp: Date.now() };
    return response.data.genres;
  } catch (error) {
    console.error('Error fetching TV genres from TMDB:', error);
    return [];
  }
}; 