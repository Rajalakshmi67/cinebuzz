
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import MovieCard from './MovieCard';
import { Movie } from '@/utils/movieData';

interface TrendingSectionProps {
  title: string;
  movies: Movie[];
  featured?: boolean;
}

const TrendingSection: React.FC<TrendingSectionProps> = ({ title, movies, featured = false }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.clientWidth * 0.75;
      
      if (direction === 'left') {
        current.scrollLeft -= scrollAmount;
      } else {
        current.scrollLeft += scrollAmount;
      }
    }
  };

  return (
    <section className="py-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white font-heading">{title}</h2>
          
          <div className="flex space-x-2">
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 rounded-full bg-cinebuzz-card text-white hover:bg-cinebuzz-accent"
              onClick={() => scroll('left')}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 rounded-full bg-cinebuzz-card text-white hover:bg-cinebuzz-accent"
              onClick={() => scroll('right')}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div 
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
        >
          {movies.map((movie) => (
            <div key={movie.id} className="flex-none w-36 md:w-44">
              <MovieCard movie={movie} featured={featured} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
