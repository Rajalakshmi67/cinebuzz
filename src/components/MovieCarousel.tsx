import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import MovieCard from './MovieCard';
import { Movie } from '@/utils/movieData';

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  loading?: boolean;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ 
  title, 
  movies,
  loading = false
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [maxSlides, setMaxSlides] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(5);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate how many slides we need based on viewport size
  useEffect(() => {
    const handleResize = () => {
      // Determine how many items to show per slide based on viewport width
      let itemsToShow = 5; // default for large screens
      
      if (window.innerWidth < 640) {
        itemsToShow = 1; // mobile
      } else if (window.innerWidth < 768) {
        itemsToShow = 2; // small tablets
      } else if (window.innerWidth < 1024) {
        itemsToShow = 3; // tablets
      } else if (window.innerWidth < 1280) {
        itemsToShow = 4; // small desktops
      }
      
      setItemsPerSlide(itemsToShow);
      
      // Calculate max number of slides
      if (movies.length > 0) {
        setMaxSlides(Math.ceil(movies.length / itemsToShow));
      }
    };

    handleResize(); // Call once on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [movies.length]);

  const handlePrev = () => {
    setCurrentSlide(prev => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = () => {
    setCurrentSlide(prev => (prev < maxSlides - 1 ? prev + 1 : prev));
  };

  // Reset to first slide when movies change
  useEffect(() => {
    setCurrentSlide(0);
  }, [movies]);

  // Ensure we don't have an invalid slide index
  useEffect(() => {
    if (currentSlide >= maxSlides && maxSlides > 0) {
      setCurrentSlide(maxSlides - 1);
    }
  }, [currentSlide, maxSlides]);

  // Group movies into slides
  const getMovieSlides = () => {
    if (!movies.length) return [];
    
    const slides = [];
    for (let i = 0; i < movies.length; i += itemsPerSlide) {
      slides.push(movies.slice(i, i + itemsPerSlide));
    }
    return slides;
  };

  const movieSlides = getMovieSlides();

  return (
    <div className="relative mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handlePrev}
            disabled={currentSlide === 0 || loading || movies.length === 0}
            className={`rounded-full ${(currentSlide === 0 || loading || movies.length === 0) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-cinebuzz-accent'}`}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleNext}
            disabled={currentSlide === maxSlides - 1 || loading || movies.length === 0}
            className={`rounded-full ${(currentSlide === maxSlides - 1 || loading || movies.length === 0) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-cinebuzz-accent'}`}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden" ref={containerRef}>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cinebuzz-accent"></div>
          </div>
        ) : movies.length > 0 ? (
          <div className="relative">
            {/* Slides container */}
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ 
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {/* Each slide */}
              {movieSlides.map((slideMovies, slideIndex) => (
                <div 
                  key={`slide-${slideIndex}`}
                  className="w-full flex-shrink-0 flex flex-wrap"
                >
                  {slideMovies.map((movie) => (
                    <div 
                      key={`movie-${movie.id}`} 
                      className="px-2"
                      style={{ width: `${100 / itemsPerSlide}%` }}
                    >
                      <MovieCard movie={movie} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-cinebuzz-subtitle">No movies available</p>
          </div>
        )}
      </div>

      {/* Slide indicators */}
      {maxSlides > 1 && movies.length > 0 && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: maxSlides }).map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all ${
                currentSlide === index 
                  ? 'w-8 bg-cinebuzz-accent' 
                  : 'w-2 bg-gray-500'
              }`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieCarousel; 