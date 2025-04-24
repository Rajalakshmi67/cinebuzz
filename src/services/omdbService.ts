import axios from 'axios';
import { Movie, Platform } from '@/utils/movieData';

const API_KEY = '45e96e64';
const API_URL = 'https://www.omdbapi.com/';

// Map platforms based on availability
const availablePlatforms: Platform[] = [
  {
    name: "Netflix",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1280px-Netflix_2015_logo.svg.png",
    url: "https://netflix.com"
  },
  {
    name: "Prime Video",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Amazon_Prime_Video_logo.svg/2560px-Amazon_Prime_Video_logo.svg.png",
    url: "https://primevideo.com"
  },
  {
    name: "Disney+",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/2560px-Disney%2B_logo.svg.png",
    url: "https://disneyplus.com"
  },
  {
    name: "HBO Max",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/HBO_Max_Logo.svg/2560px-HBO_Max_Logo.svg.png",
    url: "https://hbomax.com"
  }
];

// Interface for OMDb API response
interface OMDbResponse {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Actors: string;
  Plot: string;
  Poster: string;
  Ratings: Array<{ Source: string; Value: string }>;
  imdbRating: string;
  imdbID: string;
  Type: string;
  Response: string;
  Error?: string;
}

interface SearchResponse {
  Search: Array<{
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
  }>;
  totalResults: string;
  Response: string;
  Error?: string;
}

// Convert OMDb response to our Movie format
const convertToMovie = (data: OMDbResponse): Movie => {
  // Extract numeric rating from imdbRating
  const rating = parseFloat(data.imdbRating) || 0;
  
  // Extract year
  const year = parseInt(data.Year) || 0;
  
  // Extract genres
  const genre = data.Genre ? data.Genre.split(', ') : [];
  
  // Extract cast
  const cast = data.Actors ? data.Actors.split(', ') : [];

  // Assign random platforms (in a real app, this would come from a streaming availability API)
  const randomPlatforms = [];
  if (Math.random() > 0.5) randomPlatforms.push(availablePlatforms[0]);
  if (Math.random() > 0.5) randomPlatforms.push(availablePlatforms[1]);
  if (Math.random() > 0.7) randomPlatforms.push(availablePlatforms[2]);
  if (Math.random() > 0.8) randomPlatforms.push(availablePlatforms[3]);

  // Ensure at least one platform
  if (randomPlatforms.length === 0) {
    randomPlatforms.push(availablePlatforms[Math.floor(Math.random() * availablePlatforms.length)]);
  }

  return {
    id: parseInt(data.imdbID.replace('tt', '')) || Math.floor(Math.random() * 10000),
    title: data.Title,
    posterUrl: data.Poster !== 'N/A' ? data.Poster : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=500&auto=format&fit=crop',
    backdropUrl: data.Poster !== 'N/A' ? data.Poster : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=500&auto=format&fit=crop',
    year,
    rating,
    runtime: data.Runtime !== 'N/A' ? data.Runtime : '0 min',
    genre,
    plot: data.Plot !== 'N/A' ? data.Plot : '',
    director: data.Director !== 'N/A' ? data.Director : '',
    cast,
    trailerUrl: '', // Empty string instead of Rick Astley video
    platforms: randomPlatforms,
    language: 'English' // Assuming English as default
  };
};

// Cache for search results to avoid redundant API calls
interface SearchCache {
  [key: string]: {
    movies: Movie[];
    totalResults: number;
    timestamp: number;
  };
}

const searchCache: SearchCache = {};
const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes

// Search movies (or series/episodes) by title with pagination and type
export const searchMovies = async (
  query: string, 
  page = 1,
  type: 'movie' | 'series' | 'episode' = 'movie' // Add type parameter, default to movie
): Promise<{ movies: Movie[], totalResults: number }> => {
  try {
    // Check if we have cached results (include type in cache key)
    const cacheKey = `${type}_${query.toLowerCase()}_page${page}`;
    const now = Date.now();
    
    if (searchCache[cacheKey] && (now - searchCache[cacheKey].timestamp) < CACHE_EXPIRY) {
      return {
        movies: searchCache[cacheKey].movies,
        totalResults: searchCache[cacheKey].totalResults
      };
    }
    
    const response = await axios.get<SearchResponse>(API_URL, {
      params: {
        apikey: API_KEY,
        s: query,
        type: type, // Use the type parameter
        page
      }
    });

    if (response.data.Response === 'False') {
      // Don't log error if it's just "Movie not found."
      if (response.data.Error !== 'Movie not found.') {
         console.error('OMDb API Error:', response.data.Error);
      }
      return { movies: [], totalResults: 0 };
    }

    const totalResults = parseInt(response.data.totalResults) || 0;
    
    // Get detailed info for each movie found
    const moviePromises = response.data.Search.map(item => 
      getMovieById(item.imdbID)
    );

    const moviesData = await Promise.all(moviePromises);
    const movies = moviesData.filter(movie => movie !== null) as Movie[];
    
    // Cache the results
    searchCache[cacheKey] = {
      movies,
      totalResults,
      timestamp: now
    };
    
    return { movies, totalResults };
  } catch (error) {
    console.error('Error searching movies:', error);
    return { movies: [], totalResults: 0 };
  }
};

// Get movie by ID
export const getMovieById = async (imdbId: string): Promise<Movie | null> => {
  try {
    const response = await axios.get<OMDbResponse>(API_URL, {
      params: {
        apikey: API_KEY,
        i: imdbId,
        plot: 'full'
      }
    });

    if (response.data.Response === 'False') {
      console.error('OMDb API Error:', response.data.Error);
      return null;
    }

    return convertToMovie(response.data);
  } catch (error) {
    console.error('Error fetching movie:', error);
    return null;
  }
};

// Get popular movies (using predefined searches as OMDb doesn't have a popularity endpoint)
export const getPopularMovies = async (): Promise<Movie[]> => {
  // Use some popular movie titles to simulate trending/popular movies
  const popularQueries = ['Inception', 'Avengers', 'Matrix', 'Star Wars', 'Batman'];
  const randomQuery = popularQueries[Math.floor(Math.random() * popularQueries.length)];
  
  const result = await searchMovies(randomQuery);
  return result.movies;
};

// Get top rated movies (using predefined high-rated movies)
export const getTopRatedMovies = async (): Promise<Movie[]> => {
  // Fetch specific high-rated movies by ID
  const topRatedIds = ['tt0111161', 'tt0068646', 'tt0071562', 'tt0468569', 'tt0050083', 
                       'tt0108052', 'tt0137523', 'tt0109830', 'tt0167260', 'tt0080684'];
  
  const moviePromises = topRatedIds.map(id => getMovieById(id));
  const movies = await Promise.all(moviePromises);
  
  return movies.filter(movie => movie !== null) as Movie[];
}; 