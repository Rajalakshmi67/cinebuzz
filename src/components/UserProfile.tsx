
import React from 'react';
import { User, Film, Star, List, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User as UserType } from '@/utils/movieData';
import MovieCard from './MovieCard';
import { movies } from '@/utils/movieData';

interface UserProfileProps {
  user: UserType;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <div className="pt-24 pb-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="flex-none">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-cinebuzz-accent">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white font-heading">{user.name}</h1>
                <p className="text-cinebuzz-subtitle mb-2">@{user.username}</p>
              </div>
              
              <Button className="bg-cinebuzz-accent text-white hover:bg-cinebuzz-accent/90 w-full md:w-auto">
                Follow
              </Button>
            </div>
            
            <p className="text-cinebuzz-subtitle mt-4 mb-6">{user.bio}</p>
            
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center">
                <Film className="h-5 w-5 text-cinebuzz-accent mr-2" />
                <div>
                  <p className="text-lg font-bold text-white">{user.reviews}</p>
                  <p className="text-cinebuzz-subtitle text-sm">Reviews</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Users className="h-5 w-5 text-cinebuzz-accent mr-2" />
                <div>
                  <p className="text-lg font-bold text-white">{user.followers}</p>
                  <p className="text-cinebuzz-subtitle text-sm">Followers</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Users className="h-5 w-5 text-cinebuzz-accent mr-2" />
                <div>
                  <p className="text-lg font-bold text-white">{user.following}</p>
                  <p className="text-cinebuzz-subtitle text-sm">Following</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <Tabs defaultValue="watchlist">
            <TabsList className="bg-cinebuzz-card">
              <TabsTrigger value="watchlist" className="flex items-center">
                <Film className="h-4 w-4 mr-2" />
                Watchlist
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center">
                <Star className="h-4 w-4 mr-2" />
                Reviews
              </TabsTrigger>
              <TabsTrigger value="lists" className="flex items-center">
                <List className="h-4 w-4 mr-2" />
                Lists
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="watchlist" className="mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {user.watchlist.map(movieId => {
                  const movie = movies.find(m => m.id === movieId);
                  if (!movie) return null;
                  return <MovieCard key={movie.id} movie={movie} />;
                })}
              </div>
              
              {user.watchlist.length === 0 && (
                <div className="text-center py-12">
                  <Film className="h-12 w-12 text-cinebuzz-subtitle mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold text-white mb-2">Watchlist is empty</h3>
                  <p className="text-cinebuzz-subtitle">
                    Start adding movies to your watchlist by clicking the "+" button on movie cards.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {[1, 2, 3].map((index) => {
                  const movie = movies[index];
                  return (
                    <div key={index} className="bg-cinebuzz-card rounded-lg p-4 flex flex-col md:flex-row gap-4">
                      <div className="flex-none w-16 md:w-24">
                        <img 
                          src={movie.posterUrl} 
                          alt={movie.title} 
                          className="w-full aspect-[2/3] object-cover rounded-md"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-medium">{movie.title}</h3>
                          <div className="flex">
                            {Array(5).fill(0).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < 4 ? 'text-cinebuzz-yellow' : 'text-gray-600'}`} 
                                fill="currentColor" 
                              />
                            ))}
                          </div>
                        </div>
                        
                        <p className="text-cinebuzz-subtitle text-xs mb-2">Reviewed on April 15, 2023</p>
                        
                        <p className="text-cinebuzz-subtitle">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. 
                          Praesent eget nisl id nunc ultrices finibus. Duis eros ex, malesuada at 
                          pretium nec, tristique eget sapien.
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="lists" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  "My Top 10 Sci-Fi Movies",
                  "Best Movies of 2023",
                  "Must-Watch Thrillers"
                ].map((list, index) => (
                  <div key={index} className="bg-cinebuzz-card rounded-lg overflow-hidden">
                    <div className="flex flex-wrap">
                      {Array(4).fill(0).map((_, i) => {
                        const movie = movies[(index + i) % movies.length];
                        return (
                          <div key={i} className="w-1/2 aspect-[2/3]">
                            <img 
                              src={movie.posterUrl} 
                              alt={movie.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">{list}</h3>
                      <p className="text-cinebuzz-subtitle text-sm mb-3">
                        {index === 0 ? "10" : index === 1 ? "8" : "12"} movies
                      </p>
                      <Button variant="outline" className="w-full bg-transparent border-cinebuzz-accent text-cinebuzz-accent hover:bg-cinebuzz-accent hover:text-white">
                        View List
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
