import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TVShow } from '@/utils/tvShowData';
import { Button } from '@/components/ui/button';
import { Star, ArrowLeft, Clock, Play, Loader2, Plus, Check } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getTMDBTVShowById } from '@/services/tmdbTVService';
import { useToast } from '@/components/ui/use-toast';
import { addToWatchlist, isInWatchlist } from '@/services/watchlistService';
import { useAuthContext } from '@/context/AuthContext';

const TVShowDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuth } = useAuthContext();
  const [show, setShow] = useState<TVShow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);
  
  useEffect(() => {
    const fetchTVShowDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const tvShowData = await getTMDBTVShowById(id);
        
        if (tvShowData) {
          setShow(tvShowData);
          setError(false);
          
          // Check if the show is already in the watchlist
          if (isAuth) {
            const watchlistStatus = await isInWatchlist(id);
            setInWatchlist(watchlistStatus);
          }
        } else {
          setError(true);
          toast({
            title: "Error",
            description: "Could not load TV show details",
            variant: "destructive"
          });
        }
      } catch (err) {
        console.error("Error fetching TV show details:", err);
        setError(true);
        toast({
          title: "Error",
          description: "Failed to fetch TV show data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTVShowDetails();
  }, [id, toast, isAuth]);

  const handleWatchTrailer = () => {
    if (!show) return;
    const query = encodeURIComponent(`${show.title} ${show.year} tv show trailer`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  };

  const handleAddToWatchlist = async () => {
    if (!show || !id) return;
    
    if (!isAuth) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add TV shows to your watchlist.",
        variant: "destructive"
      });
      navigate('/signin');
      return;
    }
    
    try {
      setAddingToWatchlist(true);
      
      await addToWatchlist({
        id,
        title: show.title,
        poster: show.posterUrl,
        type: 'tv',
        rating: show.rating,
        releaseDate: show.year.toString()
      });
      
      setInWatchlist(true);
      toast({
        title: "Added to Watchlist",
        description: `${show.title} has been added to your watchlist.`,
        variant: "default"
      });
    } catch (err) {
      console.error("Error adding to watchlist:", err);
      toast({
        title: "Error",
        description: "Could not add to watchlist. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAddingToWatchlist(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-cinebuzz-background text-white">
        <Navigation />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
          <Loader2 className="h-12 w-12 animate-spin text-cinebuzz-accent" />
          <p className="mt-4 text-lg">Loading TV show details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !show) {
    return (
      <div className="min-h-screen bg-cinebuzz-background text-white">
        <Navigation />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] p-4">
          <h1 className="text-2xl font-bold mb-4">TV Show not found</h1>
          <Button onClick={() => navigate('/tv-shows')} variant="outline">
            Back to TV Shows
          </Button>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-cinebuzz-background text-white">
      <Navigation />
      
      <div className="pt-16">
        {/* Hero Section with Backdrop */}
        <div 
          className="relative w-full h-[50vh] bg-cover bg-center"
          style={{ 
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(18,18,18,1)), url(${show.backdropUrl || show.posterUrl})` 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-cinebuzz-background via-transparent to-transparent" />
          
          <div className="container mx-auto px-4 h-full flex items-end pb-8">
            <Button 
              variant="ghost" 
              className="absolute top-8 left-4 md:left-8 text-white" 
              onClick={() => navigate('/tv-shows')}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="container mx-auto px-4 -mt-32 relative z-10 pb-16">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="md:w-1/4">
              <img 
                src={show.posterUrl} 
                alt={show.title} 
                className="rounded-lg shadow-xl w-full max-w-xs mx-auto md:mx-0 aspect-[2/3] object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://placehold.co/300x450?text=No+Image';
                }}
              />
            </div>
            
            {/* Details */}
            <div className="md:w-3/4">
              <div className="flex flex-wrap gap-2 mb-3">
                {show.genre.map((genre, idx) => (
                  <span 
                    key={idx}
                    className="text-xs bg-cinebuzz-dark px-3 py-1 rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{show.title}</h1>
              
              <div className="flex items-center gap-3 text-cinebuzz-subtitle mb-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-cinebuzz-yellow mr-1" />
                  <span className="font-medium">{show.rating.toFixed(1)}</span>
                </div>
                <span>•</span>
                <span>{show.year}</span>
                <span>•</span>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>S{show.seasons} ({show.episodes} Eps)</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Synopsis</h3>
                <p className="text-cinebuzz-subtitle">{show.plot}</p>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-8">
                <Button 
                  className="gap-2 bg-cinebuzz-accent hover:bg-cinebuzz-accent/80" 
                  onClick={handleWatchTrailer}
                >
                  <Play className="h-4 w-4" />
                  Watch Trailer
                </Button>

                <Button 
                  variant={inWatchlist ? "default" : "outline"} 
                  className={`gap-2 ${inWatchlist 
                    ? "bg-green-600 hover:bg-green-700 text-white" 
                    : "border-cinebuzz-accent text-cinebuzz-accent hover:bg-cinebuzz-accent/10"}`}
                  onClick={handleAddToWatchlist}
                  disabled={addingToWatchlist || inWatchlist}
                >
                  {addingToWatchlist ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : inWatchlist ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {inWatchlist ? "Added to Watchlist" : "+ Add to Watchlist"}
                </Button>
              </div>
              
              {show.platforms && show.platforms.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Available On</h3>
                  <div className="flex flex-wrap gap-2">
                    {show.platforms.map((platform, idx) => (
                      <div 
                        key={idx}
                        className="px-4 py-2 bg-cinebuzz-dark rounded-md text-sm font-medium"
                      >
                        {platform.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {show.status && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Status</h3>
                  <div className={`inline-block px-4 py-2 rounded-md text-sm font-medium ${
                    show.status.includes('Series') 
                      ? 'bg-green-900/30 text-green-400' 
                      : show.status === 'Ended' 
                      ? 'bg-blue-900/30 text-blue-400' 
                      : 'bg-yellow-900/30 text-yellow-400'
                  }`}>
                    {show.status}
                  </div>
                </div>
              )}

              {show.cast && show.cast.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Cast</h3>
                  <div className="flex flex-wrap gap-2">
                    {show.cast.map((actor, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-cinebuzz-dark/50 rounded-md text-sm"
                      >
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TVShowDetailPage;
