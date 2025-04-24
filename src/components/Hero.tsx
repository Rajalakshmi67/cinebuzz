import React, { useState, useEffect } from 'react';
import { PlayCircle, Plus, Check, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Movie } from '@/utils/movieData';
import { addToWatchlist, isInWatchlist, removeFromWatchlist } from '@/services/watchlistService';
import { useToast } from '@/components/ui/use-toast';
import { useAuthContext } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeroProps {
  movie: Movie;
}

const Hero: React.FC<HeroProps> = ({ movie }) => {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isAuth } = useAuthContext();
  const navigate = useNavigate();

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

  const handleWatchlistToggle = async () => {
    if (!isAuth) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add movies to your watchlist.",
        variant: "destructive"
      });
      navigate('/signin');
      return;
    }

    setIsLoading(true);
    try {
      if (inWatchlist) {
        await removeFromWatchlist(movie.id.toString());
        setInWatchlist(false);
        toast({
          title: "Removed from watchlist",
          description: `${movie.title} has been removed from your watchlist.`,
          variant: "default"
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
        setInWatchlist(true);
        toast({
          title: "Added to watchlist",
          description: `${movie.title} has been added to your watchlist.`,
          variant: "default"
        });
      }
    } catch (error) {
      toast({
        title: "Action failed",
        description: "There was an error updating your watchlist. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWatchTrailer = () => {
    const query = encodeURIComponent(`${movie.title} ${movie.year} trailer`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  };

  return (
    <div className="relative h-[100vh] w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${movie.backdropUrl})`,
        }}
      >
        {/* Overlay gradients */}
        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-cinebuzz-background via-cinebuzz-background/70 to-transparent opacity-100"></div>
        {/* Left gradient */}
        <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-cinebuzz-background via-cinebuzz-background/50 to-transparent opacity-80"></div>
        {/* Top gradient - very subtle */}
        <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/10 to-transparent"></div>
      </div>
      
      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 md:px-6 z-10 flex items-end pb-16 md:pb-20 pt-16"> 
        {/* Content Block */}
        <div className="max-w-3xl animate-fade-in w-full">
          <h1 className="text-4xl md:text-6xl font-bold mb-3 text-white font-heading text-shadow">
            {movie.title}
          </h1>
          
          <div className="flex items-center space-x-4 mb-4">
            <Badge className="bg-cinebuzz-yellow text-black font-bold">
              IMDb {movie.rating}
            </Badge>
            <span className="text-cinebuzz-subtitle">{movie.year}</span>
            <span className="text-cinebuzz-subtitle">{movie.runtime}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {movie.genre.map((genre, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-white border-white/30 bg-black/20 backdrop-blur-sm"
              >
                {genre}
              </Badge>
            ))}
          </div>
          
          <p className="text-cinebuzz-subtitle mb-8 max-w-xl lg:max-w-2xl line-clamp-3 md:line-clamp-4 lg:line-clamp-none"> 
            {movie.plot}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              className="bg-cinebuzz-accent hover:bg-cinebuzz-accent/90 text-white flex items-center"
              onClick={handleWatchTrailer}
            >
              <PlayCircle className="mr-2 h-5 w-5" />
              Watch Trailer
            </Button>
            <Button 
              variant={inWatchlist ? "default" : "outline"}
              className={`bg-transparent flex items-center backdrop-blur-sm ${
                inWatchlist 
                  ? "bg-green-600 hover:bg-green-700 text-white border-green-600" 
                  : "border-white text-white hover:bg-white/10"
              }`}
              onClick={handleWatchlistToggle}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : inWatchlist ? (
                <Check className="mr-2 h-5 w-5" />
              ) : (
                <Plus className="mr-2 h-5 w-5" />
              )}
              {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
