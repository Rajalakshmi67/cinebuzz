import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import MovieDetail from '@/components/MovieDetail';
import Footer from '@/components/Footer';
import { Movie } from '@/utils/movieData';
import { getMovieById } from '@/services/omdbService';

const MoviePage = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (!id) {
          setError('Movie ID is missing');
          setLoading(false);
          return;
        }
        
        // Use the exact ID from the URL - do not convert it to a different format
        // This ensures we load the same movie the user clicked on
        const movieData = await getMovieById(`tt${id}`);
        
        if (movieData) {
          setMovie(movieData);
        } else {
          setError('Movie not found');
        }
      } catch (err) {
        console.error('Error fetching movie:', err);
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchMovie();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cinebuzz-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cinebuzz-accent"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-cinebuzz-background">
        <Navigation />
        <div className="pt-24 px-4 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Movie Not Found</h1>
          <p className="text-cinebuzz-subtitle">
            {error || "The movie you're looking for doesn't exist or has been removed."}
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cinebuzz-background flex flex-col">
      <Navigation />
      <div className="content-under-header flex-grow">
        <MovieDetail movie={movie} />
      </div>
      <Footer />
    </div>
  );
};

export default MoviePage;
