import React from 'react';
import { Star, Clock } from 'lucide-react';
import { TVShow } from '@/utils/tvShowData';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface TVShowCardProps {
  show: TVShow;
}

const TVShowCard: React.FC<TVShowCardProps> = ({ show }) => {
  return (
    <Link to={`/tv-show/${show.id}`} className="block">
      <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg bg-cinebuzz-card border-none hover:scale-105">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img 
            src={show.posterUrl} 
            alt={show.title} 
            className="object-cover h-full w-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://placehold.co/300x450?text=No+Image';
            }} 
          />
          <div className="absolute top-2 right-2 bg-cinebuzz-dark py-1 px-2 rounded-md flex items-center">
            <Star className="h-4 w-4 text-cinebuzz-yellow mr-1" />
            <span className="text-sm font-medium text-white">{show.rating.toFixed(1)}</span>
          </div>
          {show.status && (
            <div className="absolute top-2 left-2 bg-cinebuzz-accent py-1 px-2 rounded-md flex items-center">
              <span className="text-xs font-medium text-white">
                {show.status}
              </span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
            <div className="flex gap-2 flex-wrap">
              {show.platforms && show.platforms.slice(0, 2).map((platform, index) => (
                <span 
                  key={index} 
                  className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full"
                >
                  {platform.name}
                </span>
              ))}
            </div>
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="font-medium text-white text-sm md:text-base line-clamp-1">{show.title}</h3>
          <div className="flex justify-between items-center mt-1">
            <div className="text-cinebuzz-subtitle text-xs flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>S{show.seasons} • {show.episodes} Eps</span>
            </div>
            <div className="text-cinebuzz-subtitle text-xs">
              {show.year}
            </div>
          </div>
          <div className="mt-1 flex flex-wrap gap-1">
            {show.genre.slice(0, 2).map((genre, index) => (
              <span 
                key={index} 
                className="text-xs text-cinebuzz-subtitle bg-cinebuzz-dark/50 px-1.5 py-0.5 rounded"
              >
                {genre}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TVShowCard;
