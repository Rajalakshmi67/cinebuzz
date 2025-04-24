import axios from 'axios';
import { Movie } from '@/utils/movieData';

const API_KEY = '2e853e239a10686485ea5d598515cf2d';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_URL = 'https://image.tmdb.org/t/p/original';

// Define interfaces for TMDB responses
interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  runtime?: number;
  genres?: { id: number; name: string }[];
}

interface TMDBMovieDetails extends TMDBMovie {
  runtime: number;
  genres: { id: number; name: string }[];
  credits?: {
    cast: { id: number; name: string; character: string }[];
  };
}

interface TMDBResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

// Cache mechanism
const cacheData: Record<string, { data: any; timestamp: number }> = {};
const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes

// Convert TMDB movie to our app's Movie format
const convertToMovie = (tmdbMovie: TMDBMovie, details?: TMDBMovieDetails): Movie => {
  const releaseYear = tmdbMovie.release_date 
    ? parseInt(tmdbMovie.release_date.split('-')[0], 10) 
    : 0;
  
  return {
    id: tmdbMovie.id,
    title: tmdbMovie.title,
    year: releaseYear,
    rating: tmdbMovie.vote_average,
    runtime: details?.runtime ? `${details.runtime} min` : '',
    genre: details?.genres?.map(g => g.name) || [],
    cast: details?.credits?.cast?.slice(0, 5).map(actor => actor.name) || [],
    plot: tmdbMovie.overview,
    posterUrl: tmdbMovie.poster_path ? `${IMG_URL}${tmdbMovie.poster_path}` : '',
    backdropUrl: tmdbMovie.backdrop_path ? `${BACKDROP_URL}${tmdbMovie.backdrop_path}` : '',
    platforms: [],
    director: '',
    trailerUrl: '',
    language: 'English'
  };
};

// Search movies by query
export const searchTMDBMovies = async (query: string, page = 1): Promise<{ movies: Movie[]; totalPages: number }> => {
  const cacheKey = `search_${query}_${page}`;
  
  if (cacheData[cacheKey] && Date.now() - cacheData[cacheKey].timestamp < CACHE_EXPIRY) {
    return cacheData[cacheKey].data;
  }
  
  try {
    const response = await axios.get<TMDBResponse>(`${BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query,
        page,
        include_adult: false,
        language: 'en-US'
      }
    });
    
    const movies = response.data.results.map(movie => convertToMovie(movie));
    const result = { movies, totalPages: response.data.total_pages };
    
    cacheData[cacheKey] = { data: result, timestamp: Date.now() };
    return result;
  } catch (error) {
    console.error('Error searching TMDB movies:', error);
    return { movies: [], totalPages: 0 };
  }
};

// Get popular movies
export const getPopularTMDBMovies = async (page = 1): Promise<Movie[]> => {
  const cacheKey = `popular_${page}`;
  
  if (cacheData[cacheKey] && Date.now() - cacheData[cacheKey].timestamp < CACHE_EXPIRY) {
    return cacheData[cacheKey].data;
  }
  
  try {
    const response = await axios.get<TMDBResponse>(`${BASE_URL}/movie/popular`, {
      params: {
        api_key: API_KEY,
        page,
        language: 'en-US'
      }
    });
    
    const movies = response.data.results.map(movie => convertToMovie(movie));
    
    cacheData[cacheKey] = { data: movies, timestamp: Date.now() };
    return movies;
  } catch (error) {
    console.error('Error fetching popular TMDB movies:', error);
    return [];
  }
};

// Get top rated movies
export const getTopRatedTMDBMovies = async (page = 1): Promise<Movie[]> => {
  const cacheKey = `top_rated_${page}`;
  
  if (cacheData[cacheKey] && Date.now() - cacheData[cacheKey].timestamp < CACHE_EXPIRY) {
    return cacheData[cacheKey].data;
  }
  
  try {
    const response = await axios.get<TMDBResponse>(`${BASE_URL}/movie/top_rated`, {
      params: {
        api_key: API_KEY,
        page,
        language: 'en-US'
      }
    });
    
    const movies = response.data.results.map(movie => convertToMovie(movie));
    
    cacheData[cacheKey] = { data: movies, timestamp: Date.now() };
    return movies;
  } catch (error) {
    console.error('Error fetching top rated TMDB movies:', error);
    return [];
  }
};

// Get movie details by ID
export const getTMDBMovieById = async (tmdbId: string | number): Promise<Movie | null> => {
  const id = typeof tmdbId === 'string' ? tmdbId.replace('tmdb_', '') : tmdbId;
  const cacheKey = `movie_${id}`;
  
  if (cacheData[cacheKey] && Date.now() - cacheData[cacheKey].timestamp < CACHE_EXPIRY) {
    return cacheData[cacheKey].data;
  }
  
  try {
    const response = await axios.get<TMDBMovieDetails>(`${BASE_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: 'credits',
        language: 'en-US'
      }
    });
    
    const movie = convertToMovie(response.data, response.data);
    
    cacheData[cacheKey] = { data: movie, timestamp: Date.now() };
    return movie;
  } catch (error) {
    console.error(`Error fetching TMDB movie with id ${id}:`, error);
    return null;
  }
};

// Get now playing movies (new releases)
export const getNewReleasesTMDB = async (page = 1): Promise<Movie[]> => {
  const cacheKey = `now_playing_${page}`;
  
  if (cacheData[cacheKey] && Date.now() - cacheData[cacheKey].timestamp < CACHE_EXPIRY) {
    return cacheData[cacheKey].data;
  }
  
  try {
    const response = await axios.get<TMDBResponse>(`${BASE_URL}/movie/now_playing`, {
      params: {
        api_key: API_KEY,
        page,
        language: 'en-US'
      }
    });
    
    const movies = response.data.results.map(movie => convertToMovie(movie));
    
    cacheData[cacheKey] = { data: movies, timestamp: Date.now() };
    return movies;
  } catch (error) {
    console.error('Error fetching new releases from TMDB:', error);
    return [];
  }
};

// Get movies by genre
export const getMoviesByGenre = async (genreId: number, page = 1): Promise<Movie[]> => {
  const cacheKey = `genre_${genreId}_${page}`;
  
  if (cacheData[cacheKey] && Date.now() - cacheData[cacheKey].timestamp < CACHE_EXPIRY) {
    return cacheData[cacheKey].data;
  }
  
  try {
    const response = await axios.get<TMDBResponse>(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        with_genres: genreId,
        page,
        language: 'en-US',
        sort_by: 'popularity.desc'
      }
    });
    
    const movies = response.data.results.map(movie => convertToMovie(movie));
    
    cacheData[cacheKey] = { data: movies, timestamp: Date.now() };
    return movies;
  } catch (error) {
    console.error(`Error fetching TMDB movies for genre ${genreId}:`, error);
    return [];
  }
};

// Get list of genres
export const getGenres = async (): Promise<{id: number, name: string}[]> => {
  const cacheKey = 'genres';
  
  if (cacheData[cacheKey] && Date.now() - cacheData[cacheKey].timestamp < CACHE_EXPIRY) {
    return cacheData[cacheKey].data;
  }
  
  try {
    const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
      params: {
        api_key: API_KEY,
        language: 'en-US'
      }
    });
    
    cacheData[cacheKey] = { data: response.data.genres, timestamp: Date.now() };
    return response.data.genres;
  } catch (error) {
    console.error('Error fetching genres from TMDB:', error);
    return [];
  }
}; 