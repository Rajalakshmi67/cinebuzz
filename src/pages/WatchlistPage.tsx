import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthContext } from '@/context/AuthContext';
import { isAuthenticated } from '@/services/authService';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Play, Clock, Star, Calendar } from 'lucide-react';
import { getWatchlist, removeFromWatchlist } from '../services/watchlistService';

interface WatchlistItem {
  id: string;
  title: string;
  poster: string;
  type: 'movie' | 'tv';
  addedAt: string;
  rating?: number;
  releaseDate?: string;
}

const WatchlistPage: React.FC = () => {
  const { isAuth } = useAuthContext();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'movies' | 'tvshows'>('all');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated()) {
      navigate('/signin');
      return;
    }

    fetchWatchlist();
  }, [navigate]);

  const fetchWatchlist = async () => {
    try {
      setIsLoading(true);
      const data = await getWatchlist();
      setWatchlist(data);
    } catch (error) {
      toast({
        title: "Failed to load watchlist",
        description: "There was an error loading your watchlist. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromWatchlist(itemId);
      setWatchlist(prevWatchlist => prevWatchlist.filter(item => item.id !== itemId));
      toast({
        title: "Item removed",
        description: "The item was removed from your watchlist",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Failed to remove item",
        description: "There was an error removing this item. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getFilteredWatchlist = () => {
    if (activeTab === 'all') return watchlist;
    return watchlist.filter(item => 
      activeTab === 'movies' ? item.type === 'movie' : item.type === 'tv'
    );
  };

  const filteredWatchlist = getFilteredWatchlist();

  return (
    <div className="min-h-screen bg-gradient-to-b from-cinebuzz-dark to-black">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Watchlist</h1>
              <p className="text-gray-400">
                Keep track of movies and TV shows you want to watch
              </p>
            </div>
          </div>

          <Tabs 
            defaultValue="all" 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as 'all' | 'movies' | 'tvshows')}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 w-full max-w-md mb-8">
              <TabsTrigger value="all">All ({watchlist.length})</TabsTrigger>
              <TabsTrigger value="movies">Movies ({watchlist.filter(i => i.type === 'movie').length})</TabsTrigger>
              <TabsTrigger value="tvshows">TV Shows ({watchlist.filter(i => i.type === 'tv').length})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="w-full">
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cinebuzz-accent"></div>
                </div>
              ) : filteredWatchlist.length === 0 ? (
                <Card className="bg-cinebuzz-dark-light border-none shadow">
                  <CardContent className="flex flex-col items-center py-16">
                    <p className="text-white text-xl mb-4">Your watchlist is empty</p>
                    <p className="text-gray-400 mb-6">Add movies or TV shows to your watchlist to keep track of what you want to watch.</p>
                    <Button 
                      onClick={() => navigate(activeTab === 'tvshows' ? '/tv-shows' : '/movies')} 
                      className="bg-cinebuzz-accent hover:bg-cinebuzz-accent/90 text-white"
                    >
                      Browse {activeTab === 'tvshows' ? 'TV Shows' : activeTab === 'movies' ? 'Movies' : 'Content'}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredWatchlist.map(item => (
                    <Card 
                      key={item.id} 
                      className="bg-cinebuzz-dark-light border-none shadow overflow-hidden hover:shadow-lg transition-shadow group"
                    >
                      <div className="relative">
                        <img 
                          src={item.poster} 
                          alt={item.title} 
                          className="w-full h-[250px] object-cover transition-transform group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://placehold.co/300x450?text=No+Image';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center space-y-4">
                          <Button 
                            onClick={() => navigate(`/${item.type === 'movie' ? 'movie' : 'tv-show'}/${item.id}`)}
                            className="bg-cinebuzz-accent hover:bg-cinebuzz-accent/90 text-white"
                            size="sm"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button 
                            onClick={() => handleRemoveItem(item.id)}
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-white font-medium text-lg line-clamp-1">{item.title}</h3>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center text-sm text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{new Date(item.addedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            {item.type === 'movie' ? (
                              <span className="text-xs bg-cinebuzz-accent/20 text-cinebuzz-accent px-2 py-1 rounded-full">
                                Movie
                              </span>
                            ) : (
                              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                                TV Show
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-sm">
                          {item.rating && (
                            <div className="flex items-center text-yellow-500">
                              <Star className="h-3 w-3 mr-1 fill-yellow-500" />
                              <span>{item.rating}</span>
                            </div>
                          )}
                          {item.releaseDate && (
                            <div className="flex items-center text-gray-400">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{item.releaseDate.substring(0, 4)}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WatchlistPage; 