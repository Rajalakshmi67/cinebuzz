import React, { useState, useEffect } from 'react';
import { Star, Plus, Info, Check, Loader2 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Movie } from '@/utils/movieData';
import { Link, useNavigate } from 'react-router-dom';
import { addToWatchlist, isInWatchlist, removeFromWatchlist } from '@/services/watchlistService';
import { useToast } from '@/components/ui/use-toast';
import { useAuthContext } from '@/context/AuthContext';

interface MovieCardProps {
  movie: Movie;
  featured?: boolean;
  view?: "grid" | "list";
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, featured = false, view = "grid" }) => {
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

  const handleWatchlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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
  
  if (view === "list") {
    return (
      <Link to={`/movie/${movie.id}`}>
        <Card className="w-full hover:bg-cinebuzz-card/60 transition-colors bg-cinebuzz-card/30 border-cinebuzz-card/20">
          <div className="flex gap-4 p-3">
            <div className="flex-none w-20 h-28 overflow-hidden rounded-md">
              <img 
                src={movie.posterUrl || 'https://placehold.co/80x120?text=No+Image'} 
                alt={movie.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-grow">
              <h3 className="font-medium text-white">{movie.title}</h3>
              <div className="flex items-center text-cinebuzz-subtitle text-sm mt-1">
                <span>{movie.year}</span>
                {movie.runtime && (
                  <><span className="mx-2">•</span><span>{movie.runtime}</span></>
                )}
              </div>
              
              <div className="flex items-center mt-2 space-x-2">
                <Badge className="bg-black/40 text-white border-white/10">
                  <Star className="h-3 w-3 text-cinebuzz-yellow mr-1" fill="currentColor" />
                  <span>{movie.rating}</span>
                </Badge>
                
                {movie.genre && movie.genre.length > 0 && (
                  <span className="text-xs text-cinebuzz-subtitle truncate">
                    {movie.genre.slice(0, 2).join(", ")}
                    {movie.genre.length > 2 && "..."}
                  </span>
                )}
              </div>
              
              {movie.plot && (
                <p className="text-xs text-cinebuzz-subtitle mt-2 line-clamp-1">
                  {movie.plot}
                </p>
              )}
            </div>
            
            <div className="flex-none flex items-center gap-2">
              <Button 
                size="sm" 
                variant="ghost"
                className={`rounded-full h-9 w-9 p-0 ${
                  inWatchlist 
                    ? "bg-green-600 hover:bg-green-700 text-white" 
                    : "bg-cinebuzz-dark hover:bg-cinebuzz-accent text-white"
                }`}
                onClick={handleWatchlistToggle}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : inWatchlist ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
              
              <Button 
                size="sm" 
                variant="ghost"
                className="rounded-full h-9 w-9 p-0 bg-cinebuzz-dark hover:bg-cinebuzz-accent"
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </Link>
    );
  }
  
  // Default Grid view
  return (
    <Link to={`/movie/${movie.id}`}>
      <Card className={`overflow-hidden bg-transparent border-0 w-full movie-card-hover`}>
        <div className="relative aspect-[2/3] overflow-hidden rounded-md">
          <img 
            src={movie.posterUrl || 'https://placehold.co/300x450?text=No+Image'} 
            alt={movie.title} 
            className="w-full h-full object-cover transition-transform duration-300"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-3">
            <Button 
              size="icon" 
              variant="ghost" 
              className={`absolute top-2 right-2 h-8 w-8 rounded-full text-white ${
                inWatchlist 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-black/50 hover:bg-cinebuzz-accent"
              }`}
              onClick={handleWatchlistToggle}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : inWatchlist ? (
                <Check className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="absolute bottom-2 left-2 flex items-center bg-black/60 rounded-full px-2 py-1">
            <Star className="h-3 w-3 text-cinebuzz-yellow mr-1" fill="currentColor" />
            <span className="text-xs font-medium text-white">{movie.rating}</span>
          </div>
          
          {featured && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-cinebuzz-accent text-white">Featured</Badge>
            </div>
          )}
        </div>
        
        <CardContent className="pt-3 px-1">
          <h3 className="font-medium text-white line-clamp-1">{movie.title}</h3>
          <p className="text-xs text-cinebuzz-subtitle mt-1">{movie.year}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MovieCard;
