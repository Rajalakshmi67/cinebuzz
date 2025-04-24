import React, { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import MovieCarousel from '@/components/MovieCarousel';
import { Movie } from '@/utils/movieData';
import { searchMovies, getPopularMovies, getTopRatedMovies } from '@/services/omdbService';
import { getTopRatedTMDBMovies } from '@/services/tmdbService';

const Index = () => {
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [newReleasesMovies, setNewReleasesMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState({
    hero: true,
    trending: true,
    topRated: true,
    newReleases: true
  });

  // Fetch hero movie data (using the first popular movie)
  useEffect(() => {
    const fetchHeroMovie = async () => {
      try {
        const popularMovies = await getPopularMovies();
        if (popularMovies.length > 0) {
          setHeroMovie(popularMovies[0]);
        }
      } catch (error) {
        console.error('Error fetching hero movie:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, hero: false }));
      }
    };

    fetchHeroMovie();
  }, []);

  // Fetch trending movies
  useEffect(() => {
    const fetchTrendingMovies = async () => {
      setIsLoading(prev => ({ ...prev, trending: true }));
      try {
        // Use diverse search terms and fetch first 2 pages
        const searches = ['action', 'comedy', 'drama', 'thriller', 'sci-fi'];
        const promises = searches.flatMap(term => [
          searchMovies(term, 1), // Page 1
          searchMovies(term, 2)  // Page 2
        ]);
        const results = await Promise.all(promises);
        
        // Combine results, ensuring unique IDs and titles
        const seenIds = new Set<string>();
        const seenTitles = new Set<string>();
        const uniqueMovies: Movie[] = [];
        
        results.flatMap(r => r.movies).forEach(movie => {
          const movieId = `${movie.id}`;
          // Basic check for valid poster URL to improve quality
          if (movie.posterUrl && movie.posterUrl !== 'N/A' && !seenIds.has(movieId) && !seenTitles.has(movie.title)) {
            uniqueMovies.push(movie);
            seenIds.add(movieId);
            seenTitles.add(movie.title);
          }
        });
        
        setTrendingMovies(uniqueMovies.slice(0, 40)); // Limit to 40 movies
      } catch (error) {
        console.error('Error fetching trending movies:', error);
        setTrendingMovies([]); // Set empty on error
      } finally {
        setIsLoading(prev => ({ ...prev, trending: false }));
      }
    };

    fetchTrendingMovies();
  }, []);

  // Fetch top rated movies
  useEffect(() => {
    const fetchTopRatedMovies = async () => {
      setIsLoading(prev => ({ ...prev, topRated: true }));
      try {
        // Fetch top rated movies from both services and multiple pages for diversity
        const omdbTopRated = await getTopRatedMovies();
        
        // Fetch 3 pages of top rated movies from TMDB for more variety
        const tmdbPromises = [1, 2, 3].map(page => getTopRatedTMDBMovies(page));
        const tmdbResults = await Promise.all(tmdbPromises);
        
        // Combine results, ensuring unique IDs and titles
        const seenIds = new Set<string>();
        const seenTitles = new Set<string>();
        const uniqueMovies: Movie[] = [];
        
        // Add OMDB movies first
        omdbTopRated.forEach(movie => {
          const movieId = `${movie.id}`;
          if (movie.posterUrl && movie.posterUrl !== 'N/A' && !seenIds.has(movieId) && !seenTitles.has(movie.title)) {
            uniqueMovies.push(movie);
            seenIds.add(movieId);
            seenTitles.add(movie.title);
          }
        });
        
        // Then add TMDB movies
        tmdbResults.flat().forEach(movie => {
          const movieId = `${movie.id}`;
          if (movie.posterUrl && !seenIds.has(movieId) && !seenTitles.has(movie.title)) {
            uniqueMovies.push(movie);
            seenIds.add(movieId);
            seenTitles.add(movie.title);
          }
        });
        
        // Sort by rating descending to prioritize highest rated
        uniqueMovies.sort((a, b) => b.rating - a.rating);
        
        setTopRatedMovies(uniqueMovies.slice(0, 40)); // Limit to 40 movies
      } catch (error) {
        console.error('Error fetching top rated movies:', error);
        setTopRatedMovies([]);
      } finally {
        setIsLoading(prev => ({ ...prev, topRated: false }));
      }
    };

    fetchTopRatedMovies();
  }, []);

  // Fetch new releases
  useEffect(() => {
    const fetchNewReleases = async () => {
      setIsLoading(prev => ({ ...prev, newReleases: true }));
      try {
        // Use year queries and fetch first 2 pages
        const currentYear = new Date().getFullYear();
        const yearQueries = [currentYear.toString(), (currentYear - 1).toString()];
        const promises = yearQueries.flatMap(query => [
            searchMovies(query, 1), // Page 1
            searchMovies(query, 2)  // Page 2
        ]);
        const results = await Promise.all(promises);
        
        // Combine results, ensuring unique IDs and titles
        const seenIds = new Set<string>();
        const seenTitles = new Set<string>();
        const uniqueMovies: Movie[] = [];
        
        results.flatMap(r => r.movies).forEach(movie => {
          const movieId = `${movie.id}`;
          // Basic check for valid poster URL
          if (movie.posterUrl && movie.posterUrl !== 'N/A' && !seenIds.has(movieId) && !seenTitles.has(movie.title)) {
            uniqueMovies.push(movie);
            seenIds.add(movieId);
            seenTitles.add(movie.title);
          }
        });
        
        // Sort by year descending to prioritize newer releases
        uniqueMovies.sort((a, b) => b.year - a.year);

        setNewReleasesMovies(uniqueMovies.slice(0, 40)); // Limit to 40 movies
      } catch (error) {
        console.error('Error fetching new releases:', error);
        setNewReleasesMovies([]);
      } finally {
        setIsLoading(prev => ({ ...prev, newReleases: false }));
      }
    };

    fetchNewReleases();
  }, []);

  return (
    <div className="min-h-screen bg-cinebuzz-background">
      <Navigation />
      
      <main>
        {isLoading.hero ? (
          <div className="w-full h-[70vh] bg-gradient-to-b from-cinebuzz-card to-cinebuzz-background flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cinebuzz-accent"></div>
          </div>
        ) : heroMovie ? (
          <Hero movie={heroMovie} />
        ) : (
          <div className="w-full h-[70vh] bg-gradient-to-b from-cinebuzz-card to-cinebuzz-background flex items-center justify-center">
            <p className="text-white text-xl">Failed to load featured content</p>
          </div>
        )}
        
        <div className="py-4 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <MovieCarousel 
              title="Trending Now" 
              movies={trendingMovies} 
              loading={isLoading.trending} 
            />
            
            <MovieCarousel 
              title="Top Rated" 
              movies={topRatedMovies} 
              loading={isLoading.topRated} 
            />
            
            <MovieCarousel 
              title="New Releases" 
              movies={newReleasesMovies} 
              loading={isLoading.newReleases} 
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
