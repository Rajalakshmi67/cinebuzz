
import React, { useState, useEffect, useRef } from 'react';
import { X, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { movies } from '@/utils/movieData';
import { Link } from 'react-router-dom';

interface SearchBarProps {
  onClose?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<typeof movies>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node) && onClose) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    if (searchTerm.length > 1) {
      const filteredResults = movies.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase())) ||
        movie.director.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  return (
    <div ref={searchRef} className="relative">
      <div className="flex items-center bg-cinebuzz-card rounded-md">
        <Search className="ml-3 h-4 w-4 text-cinebuzz-subtitle" />
        <Input
          type="text"
          placeholder="Search for movies, genres, actors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-none bg-transparent text-white focus-visible:ring-0"
          autoFocus
        />
        {onClose && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="text-cinebuzz-subtitle hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-cinebuzz-card rounded-md shadow-lg overflow-hidden z-50 max-h-96 overflow-y-auto scrollbar-hide">
          {searchResults.map(movie => (
            <Link 
              key={movie.id}
              to={`/movie/${movie.id}`}
              onClick={onClose}
              className="flex items-center p-3 hover:bg-cinebuzz-primary/30 transition-colors"
            >
              <img 
                src={movie.posterUrl} 
                alt={movie.title} 
                className="h-16 w-10 object-cover rounded-sm"
              />
              <div className="ml-3">
                <p className="text-white font-medium">{movie.title}</p>
                <p className="text-cinebuzz-subtitle text-sm">{movie.year} • {movie.genre.join(', ')}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
