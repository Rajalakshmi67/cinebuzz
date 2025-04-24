import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthContext } from '@/context/AuthContext';
import { getWatchlist, WatchlistItem } from '@/services/watchlistService';
import { Clock, ExternalLink } from 'lucide-react';

const ProfilePage = () => {
  const { user, isAuth, logout } = useAuthContext();
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoadingWatchlist, setIsLoadingWatchlist] = useState(false);

  // Redirect to sign in page if not authenticated
  useEffect(() => {
    if (!isAuth) {
      navigate('/signin');
    } else {
      fetchWatchlist();
    }
  }, [isAuth, navigate]);

  const fetchWatchlist = async () => {
    try {
      setIsLoadingWatchlist(true);
      const data = await getWatchlist();
      setWatchlist(data);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    } finally {
      setIsLoadingWatchlist(false);
    }
  };

  if (!isAuth || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cinebuzz-dark to-black">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <Card className="max-w-md mx-auto bg-cinebuzz-dark-light border-none shadow">
            <CardContent className="pt-6">
              <div className="text-center py-6">
                <h3 className="text-white text-xl mb-2">Please sign in to view your profile</h3>
                <p className="text-gray-400 mb-4">You need to be logged in to access this page</p>
                <Button 
                  onClick={() => navigate('/signin')}
                  className="bg-cinebuzz-accent hover:bg-cinebuzz-accent/90"
                >
                  Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cinebuzz-dark to-black">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <p className="text-gray-400">Manage your account and preferences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card className="bg-cinebuzz-dark-light border-none shadow h-full">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || "User"}`} 
                        alt={user.name} 
                      />
                      <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-white font-bold text-xl">{user.name}</h3>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                    <div className="bg-cinebuzz-dark px-3 py-1 rounded-full text-xs text-white">
                      Member since {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-cinebuzz-accent text-cinebuzz-accent hover:bg-cinebuzz-accent hover:text-white"
                    >
                      Edit Profile
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full text-red-500 hover:bg-red-500/10 hover:text-red-500"
                      onClick={() => {
                        logout();
                        navigate('/signin');
                      }}
                    >
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  <TabsTrigger value="watchlist">My Watchlist</TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal">
                  <Card className="bg-cinebuzz-dark-light border-none shadow">
                    <CardHeader>
                      <CardTitle className="text-white">Account Information</CardTitle>
                      <CardDescription>Your personal details</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 border-b border-gray-800 pb-2">
                          <span className="text-gray-400">Name</span>
                          <span className="text-white">{user.name}</span>
                        </div>
                        <div className="grid grid-cols-2 border-b border-gray-800 pb-2">
                          <span className="text-gray-400">Email</span>
                          <span className="text-white">{user.email}</span>
                        </div>
                        <div className="grid grid-cols-2 border-b border-gray-800 pb-2">
                          <span className="text-gray-400">Account Created</span>
                          <span className="text-white">{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="grid grid-cols-2 border-b border-gray-800 pb-2">
                          <span className="text-gray-400">Profile Image</span>
                          <span className="text-white">Default Avatar</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button className="bg-cinebuzz-accent hover:bg-cinebuzz-accent/90">
                        Edit Information
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="preferences">
                  <Card className="bg-cinebuzz-dark-light border-none shadow">
                    <CardHeader>
                      <CardTitle className="text-white">Content Preferences</CardTitle>
                      <CardDescription>Customize your experience</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-white font-medium mb-2">Favorite Genres</h3>
                          <div className="flex flex-wrap gap-2">
                            <div className="bg-cinebuzz-dark px-3 py-1 rounded-full text-xs text-white">
                              Action
                            </div>
                            <div className="bg-cinebuzz-dark px-3 py-1 rounded-full text-xs text-white">
                              Sci-Fi
                            </div>
                            <div className="bg-cinebuzz-dark px-3 py-1 rounded-full text-xs text-white">
                              Drama
                            </div>
                            <Button variant="outline" className="px-3 py-1 h-6 rounded-full text-xs border-cinebuzz-accent text-cinebuzz-accent">
                              + Add Genre
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-white font-medium mb-2">Content Language</h3>
                          <div className="flex flex-wrap gap-2">
                            <div className="bg-cinebuzz-accent px-3 py-1 rounded-full text-xs text-white">
                              English
                            </div>
                            <div className="bg-cinebuzz-dark px-3 py-1 rounded-full text-xs text-white">
                              Hindi
                            </div>
                            <div className="bg-cinebuzz-dark px-3 py-1 rounded-full text-xs text-white">
                              Spanish
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-white font-medium mb-2">Streaming Services</h3>
                          <div className="flex flex-wrap gap-2">
                            <div className="bg-cinebuzz-accent px-3 py-1 rounded-full text-xs text-white">
                              Netflix
                            </div>
                            <div className="bg-cinebuzz-accent px-3 py-1 rounded-full text-xs text-white">
                              Prime Video
                            </div>
                            <div className="bg-cinebuzz-dark px-3 py-1 rounded-full text-xs text-white">
                              Disney+
                            </div>
                            <div className="bg-cinebuzz-dark px-3 py-1 rounded-full text-xs text-white">
                              HBO Max
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button className="bg-cinebuzz-accent hover:bg-cinebuzz-accent/90">
                        Save Preferences
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="watchlist">
                  <Card className="bg-cinebuzz-dark-light border-none shadow">
                    <CardHeader className="flex flex-row justify-between items-center">
                      <div>
                        <CardTitle className="text-white">My Watchlist</CardTitle>
                        <CardDescription>Movies and TV shows you want to watch</CardDescription>
                      </div>
                      <Button 
                        onClick={() => navigate('/watchlist')}
                        className="bg-cinebuzz-accent/20 text-cinebuzz-accent hover:bg-cinebuzz-accent hover:text-white"
                        size="sm"
                      >
                        View Full Watchlist
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {isLoadingWatchlist ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cinebuzz-accent"></div>
                        </div>
                      ) : watchlist.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-white mb-4">Your watchlist is currently empty</p>
                          <Button 
                            onClick={() => navigate('/movies')}
                            className="bg-cinebuzz-accent hover:bg-cinebuzz-accent/90"
                          >
                            Browse Movies
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {watchlist.slice(0, 4).map(item => (
                            <div 
                              key={item.id}
                              className="flex space-x-4 border-b border-gray-800 pb-4 mb-4 last:border-0"
                            >
                              <img 
                                src={item.poster}
                                alt={item.title}
                                className="w-16 h-24 object-cover rounded-md"
                              />
                              <div className="flex-1">
                                <h3 className="text-white font-medium">{item.title}</h3>
                                <div className="flex items-center text-sm text-gray-400 mt-1">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>Added {new Date(item.addedAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center mt-2">
                                  <span className={`text-xs ${
                                    item.type === 'movie' 
                                      ? 'bg-cinebuzz-accent/20 text-cinebuzz-accent' 
                                      : 'bg-blue-500/20 text-blue-400'
                                  } px-2 py-1 rounded-full mr-2`}>
                                    {item.type === 'movie' ? 'Movie' : 'TV Show'}
                                  </span>
                                  {item.releaseDate && (
                                    <span className="text-xs text-gray-400">
                                      {item.releaseDate.substring(0, 4)}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <Link
                                to={`/${item.type === 'movie' ? 'movie' : 'tv-show'}/${item.id}`}
                                className="flex items-center justify-center h-10 w-10 bg-cinebuzz-dark hover:bg-cinebuzz-accent/20 rounded-full text-gray-400 hover:text-cinebuzz-accent transition-colors"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </div>
                          ))}
                          {watchlist.length > 4 && (
                            <div className="text-center pt-2">
                              <Button 
                                onClick={() => navigate('/watchlist')} 
                                variant="outline"
                                className="border-cinebuzz-accent text-cinebuzz-accent hover:bg-cinebuzz-accent hover:text-white"
                              >
                                See All ({watchlist.length}) Items
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
