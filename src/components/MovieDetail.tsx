import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Play, Plus, Share, Star, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addToWatchlist, isInWatchlist, removeFromWatchlist } from '@/services/watchlistService';
import MovieCard from "@/components/MovieCard";
import { movies } from "@/utils/movieData";
import ShareButton from "@/components/ShareButton";
import { Movie } from "@/utils/movieData";
import { useAuthContext } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { getMovieReviews, deleteReview, Review } from '@/services/reviewService';

interface MovieDetailProps {
  movie: Movie;
}

const MovieDetail: React.FC<MovieDetailProps> = ({ movie }) => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isAuth } = useAuthContext();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  useEffect(() => {
    const checkWatchlist = async () => {
      if (isAuth) {
        try {
          const isInList = await isInWatchlist(movie.id.toString());
          setInWatchlist(isInList);
        } catch (error) {
          console.error('Error checking watchlist:', error);
        }
      }
    };

    checkWatchlist();
  }, [movie.id, isAuth]);

  useEffect(() => {
    if (selectedTab === "reviews") {
      fetchReviews();
    }
  }, [selectedTab, movie.id]);

  const fetchReviews = async () => {
    try {
      setIsLoadingReviews(true);
      const movieReviews = await getMovieReviews(movie.id.toString());
      setReviews(movieReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const handleWatchlistToggle = async () => {
    if (!isAuth) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to manage your watchlist",
        variant: "destructive",
      });
      navigate("/signin");
      return;
    }

    try {
      setIsLoading(true);
      if (inWatchlist) {
        await removeFromWatchlist(movie.id.toString());
        toast({
          title: "Removed from Watchlist",
          description: `"${movie.title}" has been removed from your watchlist`,
          variant: "default",
        });
      } else {
        await addToWatchlist({
          id: movie.id.toString(),
          title: movie.title,
          poster: movie.posterUrl,
          type: 'movie',
          rating: movie.rating,
          releaseDate: `${movie.year}-01-01`
        });
        toast({
          title: "Added to Watchlist",
          description: `"${movie.title}" has been added to your watchlist`,
          variant: "default",
        });
      }
      setInWatchlist(!inWatchlist);
    } catch (error) {
      console.error("Error updating watchlist:", error);
      toast({
        title: "Error",
        description: "Failed to update your watchlist",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewAdded = () => {
    fetchReviews();
  };

  const handleWatchTrailer = () => {
    const query = encodeURIComponent(`${movie.title} ${movie.year} trailer`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const success = await deleteReview(reviewId);
      if (success) {
        fetchReviews();
        toast({
          title: "Review Deleted",
          description: "Your review has been successfully deleted",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({
        title: "Error",
        description: "Failed to delete your review",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="pt-4">
      <div className="relative h-[50vh] w-full overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${movie.backdropUrl})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-cinebuzz-background via-cinebuzz-background/70 to-transparent opacity-100"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-transparent opacity-40"></div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-72 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-none">
            <div className="w-48 md:w-64 aspect-[2/3] rounded-lg overflow-hidden shadow-xl">
              <img 
                src={movie.posterUrl} 
                alt={movie.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="flex-grow">
            <h1 className="text-3xl md:text-5xl font-bold text-white font-heading mb-3">
              {movie.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-cinebuzz-yellow mr-1" fill="currentColor" />
                <span className="text-white font-bold">{movie.rating}</span>
                <span className="text-cinebuzz-subtitle ml-1">/10</span>
              </div>
              
              <div className="text-cinebuzz-subtitle">{movie.year}</div>
              
              <div className="flex items-center text-cinebuzz-subtitle">
                <Clock className="h-4 w-4 mr-1" />
                {movie.runtime}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-8">
              <Button 
                className="bg-cinebuzz-accent hover:bg-cinebuzz-accent/90 text-white flex items-center"
                onClick={handleWatchTrailer}
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Trailer
              </Button>
              <Button 
                variant={inWatchlist ? "default" : "outline"}
                className={inWatchlist 
                  ? "bg-green-600 hover:bg-green-700 text-white flex items-center" 
                  : "bg-transparent border-white text-white hover:bg-white/10 flex items-center"
                }
                onClick={handleWatchlistToggle}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Processing...
                  </span>
                ) : (
                  <>
                    {inWatchlist ? (
                      <>
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        In Watchlist
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-5 w-5" />
                        Add to Watchlist
                      </>
                    )}
                  </>
                )}
              </Button>
              <ShareButton 
                contentId={movie.id.toString()} 
                contentType="movie" 
                title={movie.title} 
                imageUrl={movie.posterUrl} 
              />
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-2">Available on</h3>
              <div className="flex gap-4">
                {movie.platforms.map((platform, index) => (
                  <a 
                    key={index} 
                    href={platform.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-cinebuzz-card hover:bg-cinebuzz-card/70 py-2 px-4 rounded-lg transition-colors"
                  >
                    <img 
                      src={platform.logo} 
                      alt={platform.name} 
                      className="h-8 object-contain"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <Tabs defaultValue="overview" className="w-full" onValueChange={setSelectedTab}>
            <TabsList className="bg-cinebuzz-card w-full justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="cast">Cast & Crew</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="similar">Similar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Synopsis</h3>
                  <p className="text-cinebuzz-subtitle leading-relaxed">{movie.plot}</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-white font-medium">Director</h4>
                      <p className="text-cinebuzz-subtitle">{movie.director}</p>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Genre</h4>
                      <p className="text-cinebuzz-subtitle">{movie.genre.join(', ')}</p>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Release Year</h4>
                      <p className="text-cinebuzz-subtitle">{movie.year}</p>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Runtime</h4>
                      <p className="text-cinebuzz-subtitle">{movie.runtime}</p>
                    </div>
                  </div>
                </div>
                
                {movie.trailerUrl && (
                  <div className="aspect-video w-full overflow-hidden rounded-lg">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={movie.trailerUrl}
                      title={`${movie.title} Trailer`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="cast" className="mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {movie.cast.map((actor, index) => (
                  <div key={index} className="bg-cinebuzz-card rounded-lg p-4 text-center">
                    <div className="w-24 h-24 mx-auto rounded-full bg-cinebuzz-primary mb-3 overflow-hidden">
                      <img 
                        src={`https://i.pravatar.cc/150?img=${index + 10}`}
                        alt={actor}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-white font-medium">{actor}</p>
                    <p className="text-cinebuzz-subtitle text-sm">Character Name</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {isAuth ? (
                  <ReviewForm movieId={movie.id.toString()} onReviewAdded={handleReviewAdded} />
                ) : (
                  <div className="bg-cinebuzz-card rounded-lg p-4 text-center mb-6">
                    <p className="text-white mb-3">Sign in to write a review</p>
                    <Button 
                      className="bg-cinebuzz-accent text-white hover:bg-cinebuzz-accent/90"
                      onClick={() => navigate('/signin')}
                    >
                      Sign In
                    </Button>
                  </div>
                )}
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">User Reviews</h3>
                  {isLoadingReviews ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cinebuzz-accent"></div>
                    </div>
                  ) : (
                    <ReviewList 
                      reviews={reviews} 
                      onDelete={handleDeleteReview}
                    />
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="similar" className="mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {movies
                  .filter(m => m.id !== movie.id && m.genre.some(g => movie.genre.includes(g)))
                  .slice(0, 5)
                  .map((similarMovie) => (
                    <MovieCard key={similarMovie.id} movie={similarMovie} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;