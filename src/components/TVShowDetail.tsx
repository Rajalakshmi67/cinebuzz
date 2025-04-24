import React, { useState } from 'react';
import { Star, Clock, Plus, Play } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TVShow } from '@/utils/tvShowsData';
import TVShowCard from '@/components/TVShowCard';
import ShareButton from "@/components/ShareButton";

interface TVShowDetailProps {
  show: TVShow;
}

const TVShowDetail: React.FC<TVShowDetailProps> = ({ show }) => {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Map TVShow properties to the expected variable names
  const backdrop = show.poster; // Using poster as backdrop
  const plot = show.synopsis;
  const creator = 'Unknown'; // Default as this doesn't exist in TVShow
  const trailer = ''; // Default as this doesn't exist in TVShow
  const cast = []; // Default as actors doesn't exist in TVShow

  const handleWatchTrailer = () => {
    const query = encodeURIComponent(`${show.title} ${show.year} tv show trailer`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  };

  return (
    <div className="pt-16">
      <div className="relative h-[50vh] w-full overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${backdrop})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-cinebuzz-background via-cinebuzz-background/70 to-transparent opacity-100"></div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-72 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-none">
            <div className="w-48 md:w-64 aspect-[2/3] rounded-lg overflow-hidden shadow-xl">
              <img 
                src={show.poster} 
                alt={show.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="flex-grow">
            <h1 className="text-3xl md:text-5xl font-bold text-white font-heading mb-3">
              {show.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-cinebuzz-yellow mr-1" fill="currentColor" />
                <span className="text-white font-bold">{show.rating}</span>
                <span className="text-cinebuzz-subtitle ml-1">/10</span>
              </div>
              
              <div className="text-cinebuzz-subtitle">{show.year}</div>
              
              <div className="flex items-center text-cinebuzz-subtitle">
                <Clock className="h-4 w-4 mr-1" />
                <span>S{show.seasons} • {show.episodes} Episodes</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {show.genre.map((genre, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-white border-white/30"
                >
                  {genre}
                </Badge>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <Button 
                className="bg-cinebuzz-accent hover:bg-cinebuzz-accent/90 text-white flex items-center"
                onClick={handleWatchTrailer}
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Trailer
              </Button>
              <Button 
                variant="outline" 
                className="bg-transparent border-white text-white hover:bg-white/10 flex items-center"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add to Watchlist
              </Button>
              <ShareButton 
                contentId={show.id} 
                contentType="tvshow" 
                title={show.title} 
                imageUrl={show.poster} 
              />
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-2">Available on</h3>
              <div className="flex gap-4">
                {show.platform.map((platform, index) => (
                  <div
                    key={index}
                    className="bg-cinebuzz-card hover:bg-cinebuzz-card/70 py-2 px-4 rounded-lg transition-colors"
                  >
                    {platform}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <Tabs defaultValue="overview" className="w-full" onValueChange={setSelectedTab}>
            <TabsList className="bg-cinebuzz-card w-full justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="episodes">Episodes</TabsTrigger>
              <TabsTrigger value="cast">Cast & Crew</TabsTrigger>
              <TabsTrigger value="similar">Similar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Synopsis</h3>
                  <p className="text-cinebuzz-subtitle leading-relaxed">{plot}</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-white font-medium">Language</h4>
                      <p className="text-cinebuzz-subtitle">{show.language}</p>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Genre</h4>
                      <p className="text-cinebuzz-subtitle">{show.genre.join(', ')}</p>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">First Air Date</h4>
                      <p className="text-cinebuzz-subtitle">{show.year}</p>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Status</h4>
                      <p className="text-cinebuzz-subtitle">{show.status}</p>
                    </div>
                  </div>
                </div>
                
                {trailer && (
                  <div className="aspect-video w-full overflow-hidden rounded-lg">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={`https://www.youtube.com/embed/${trailer}`}
                      title={`${show.title} Trailer`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="episodes" className="mt-6">
              <div className="space-y-4">
                {Array.from({ length: 5 }, (_, i) => i + 1).map((episode) => (
                  <div key={episode} className="bg-cinebuzz-card p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-medium">Episode {episode}</h3>
                      <span className="text-cinebuzz-subtitle text-sm">45 min</span>
                    </div>
                    <p className="text-cinebuzz-subtitle text-sm mb-3">Episode description goes here...</p>
                    <Button variant="outline" size="sm" className="text-cinebuzz-accent border-cinebuzz-accent/50 bg-transparent hover:bg-cinebuzz-accent/10">
                      Watch
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="cast" className="mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {cast.length > 0 ? cast.map((actor, index) => (
                  <div key={index} className="bg-cinebuzz-card rounded-lg p-4 text-center">
                    <div className="w-24 h-24 mx-auto rounded-full bg-cinebuzz-primary mb-3 overflow-hidden">
                      <img 
                        src={`https://i.pravatar.cc/150?img=${index + 10}`} 
                        alt={actor} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="text-white font-medium">{actor}</h4>
                    <p className="text-cinebuzz-subtitle text-sm">Character Name</p>
                  </div>
                )) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-cinebuzz-subtitle">No cast information available</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="similar" className="mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, index) => (
                  <TVShowCard 
                    key={index} 
                    show={{
                      id: show.id + 100 + index,
                      title: `Similar Show ${index + 1}`,
                      poster: `https://picsum.photos/300/450?random=${index + 1}`,
                      rating: 8.0,
                      year: 2023,
                      language: show.language,
                      genre: ["Drama", "Action"],
                      seasons: 2,
                      episodes: 24,
                      status: "Ongoing",
                      synopsis: "A similar show with an interesting plot.",
                      platform: ["Netflix", "Hulu"]
                    }} 
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TVShowDetail;
