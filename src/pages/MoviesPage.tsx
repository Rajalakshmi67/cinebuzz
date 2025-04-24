import React, { useState, useEffect } from 'react';
import { Search, Film, List, Grid, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import MovieCard from '@/components/MovieCard';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { searchMovies, getPopularMovies, getTopRatedMovies } from '@/services/omdbService';
import { 
  searchTMDBMovies, 
  getPopularTMDBMovies, 
  getTopRatedTMDBMovies, 
  getNewReleasesTMDB,
  getMoviesByGenre,
  getGenres
} from '@/services/tmdbService';
import { Movie } from '@/utils/movieData';

const genres = ["All", "Action", "Adventure", "Comedy", "Crime", "Drama", "Fantasy", "Horror", "Romance", "Sci-Fi", "Thriller"];
const years = ["All", "2025", "2024", "2023", "2022", "2021", "2020", "2010s", "2000s", "1990s", "Older"];
const platforms = ["All", "Netflix", "Prime Video", "Disney+", "HBO Max", "Hulu", "Apple TV+"];
const sortOptions = ["Trending", "Top Rated", "Newest", "Oldest", "Most Reviewed"];
const ITEMS_PER_PAGE = 20; // Increased items per page

const MoviesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [genres, setGenres] = useState<string[]>(["All"]);
  const [genreMap, setGenreMap] = useState<{[key: string]: number}>({});
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [sortBy, setSortBy] = useState("Trending");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [movies, setMovies] = useState<Movie[]>([]); // Holds the movies for the current page
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]); // Holds the filtered/sorted view of the current page's movies
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [dataSource, setDataSource] = useState<"combined" | "omdb" | "tmdb">("combined");

  // Fetch genre list from TMDB
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreData = await getGenres();
        const genreNames = ["All", ...genreData.map(g => g.name)];
        setGenres(genreNames);
        
        // Create a mapping of genre names to IDs for later use
        const mapping: {[key: string]: number} = {};
        genreData.forEach(g => {
          mapping[g.name] = g.id;
        });
        setGenreMap(mapping);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    
    fetchGenres();
  }, []);

  // Centralized function to fetch movie data from both APIs based on current state
  const fetchMovieData = async (page: number, query: string | null = null) => {
    setIsLoading(true);
    try {
      let omdbResults: { movies: Movie[], totalResults: number } = { movies: [], totalResults: 0 };
      let tmdbResults: { movies: Movie[], totalPages: number } = { movies: [], totalPages: 0 };
      
      let searchTerm = query || searchQuery; // Use explicit query or current search state

      if (dataSource === "omdb" || dataSource === "combined") {
        // Fetch from OMDB
        if (searchTerm) {
          omdbResults = await searchMovies(searchTerm, page);
        } else {
          // Fetch based on active tab if no search term
          switch (activeTab) {
            case "all":
              omdbResults = await searchMovies('movie', page);
              break;
            case "trending":
              const popular = await getPopularMovies();
              omdbResults = { movies: popular, totalResults: popular.length };
              break;
            case "critics":
              const topRated = await getTopRatedMovies();
              omdbResults = { movies: topRated, totalResults: topRated.length };
              break;
            default:
              omdbResults = { movies: [], totalResults: 0 };
          }
        }
      }

      if (dataSource === "tmdb" || dataSource === "combined") {
        // Fetch from TMDB
        if (searchTerm) {
          tmdbResults = await searchTMDBMovies(searchTerm, page);
        } else {
          // Fetch based on active tab
          switch (activeTab) {
            case "all":
              const popularMovies = await getPopularTMDBMovies(page);
              tmdbResults = { movies: popularMovies, totalPages: 500 }; // TMDB has many pages
              break;
            case "trending":
              const trendingMovies = await getPopularTMDBMovies(page);
              tmdbResults = { movies: trendingMovies, totalPages: 500 };
              break;
            case "critics":
              const topRatedTMDB = await getTopRatedTMDBMovies(page);
              tmdbResults = { movies: topRatedTMDB, totalPages: 500 };
              break;
            case "global":
              // For global, we'll get new releases
              const newReleases = await getNewReleasesTMDB(page);
              tmdbResults = { movies: newReleases, totalPages: 100 };
              break;
            default:
              if (selectedGenre !== "All" && genreMap[selectedGenre]) {
                const genreId = genreMap[selectedGenre];
                const genreMovies = await getMoviesByGenre(genreId, page);
                tmdbResults = { movies: genreMovies, totalPages: 500 };
              } else {
                tmdbResults = { movies: [], totalPages: 0 };
              }
          }
        }
      }

      // Combine results if using both APIs
      let combinedMovies: Movie[] = [];
      let totalPageCount = 1;
      let totalResultCount = 0;

      if (dataSource === "combined") {
        // Deduplicate by title (not perfect but good enough for demo)
        const seenTitles = new Set<string>();
        const tmpCombined = [...omdbResults.movies, ...tmdbResults.movies];
        
        combinedMovies = tmpCombined.filter(movie => {
          if (seenTitles.has(movie.title)) {
            return false;
          }
          seenTitles.add(movie.title);
          return true;
        });
        
        totalResultCount = omdbResults.totalResults + tmdbResults.totalPages * ITEMS_PER_PAGE;
        totalPageCount = Math.max(Math.ceil(totalResultCount / ITEMS_PER_PAGE), tmdbResults.totalPages);
      } else if (dataSource === "omdb") {
        combinedMovies = omdbResults.movies;
        totalResultCount = omdbResults.totalResults;
        totalPageCount = Math.ceil(totalResultCount / ITEMS_PER_PAGE);
      } else { // tmdb
        combinedMovies = tmdbResults.movies;
        totalResultCount = tmdbResults.totalPages * ITEMS_PER_PAGE;
        totalPageCount = tmdbResults.totalPages;
      }

      setMovies(combinedMovies);
      setTotalResults(totalResultCount);
      setTotalPages(Math.max(1, totalPageCount));
      setCurrentPage(page);

    } catch (error) {
      console.error("Error fetching movies:", error);
      setMovies([]);
      setTotalResults(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchMovieData(1); // Fetch page 1 initially
  }, []); // Runs only once on mount

  // Effect for handling search query changes (debounced)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchMovieData(1, searchQuery.trim()); // Fetch page 1 for new search
      } else {
        // If search is cleared, refetch based on the active tab
        fetchMovieData(1);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]); // Re-run when search query changes

   // Effect for handling changes in filters, sorting, active tab, and current page data
   useEffect(() => {
    let result = [...movies]; // Start with the movies fetched for the current page

    // Apply client-side filters
    if (selectedGenre !== "All") {
      result = result.filter(movie =>
        movie.genre.some(g => g.includes(selectedGenre) || g === selectedGenre)
      );
    }
    if (selectedYear !== "All") {
      if (selectedYear.includes("s")) {
        const decade = parseInt(selectedYear.slice(0, 4));
        result = result.filter(movie =>
          movie.year >= decade && movie.year < decade + 10
        );
      } else if (selectedYear === "Older") {
        result = result.filter(movie => movie.year < 1990);
      } else {
        const year = parseInt(selectedYear);
        result = result.filter(movie => movie.year === year);
      }
    }
    if (selectedPlatform !== "All") {
      result = result.filter(movie =>
        movie.platforms.some(platform => platform.name === selectedPlatform)
      );
    }

    // Apply client-side sorting
    switch (sortBy) {
      case "Top Rated": result.sort((a, b) => b.rating - a.rating); break;
      case "Newest": result.sort((a, b) => b.year - a.year); break;
      case "Oldest": result.sort((a, b) => a.year - b.year); break;
      case "Most Reviewed": result.sort((a, b) => b.rating - a.rating); break;
      case "Trending": default:
        result.sort((a, b) => (b.rating * 0.7 + (b.year / 2024) * 0.3) - (a.rating * 0.7 + (a.year / 2024) * 0.3));
        break;
    }

    setFilteredMovies(result); // Update the displayed movies

  }, [movies, selectedGenre, selectedYear, selectedPlatform, sortBy]); // Re-run when fetched movies or filters/sort change


  // Effect to fetch data when activeTab or data source changes
  useEffect(() => {
    fetchMovieData(1); // Fetch page 1 for the new tab or data source
  }, [activeTab, dataSource, selectedGenre]); // Re-run when active tab or data source changes


  // Handle page changes by fetching data for the new page
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      fetchMovieData(page); // Fetch the requested page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setSearchQuery(""); // Clear search query when changing tabs
    setActiveTab(value);
    // Fetching for the new tab is handled by the useEffect watching activeTab
  };

  // Handle data source changes
  const handleDataSourceChange = (source: "combined" | "omdb" | "tmdb") => {
    setDataSource(source);
    // Fetching for the new source is handled by the useEffect
  };

  // Function to generate page numbers for pagination control
  const getPageNumbers = () => {
    if (totalPages === 0) return [1];

    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        end = Math.min(4, totalPages - 1);
      } else if (currentPage >= totalPages - 1) {
        start = Math.max(2, totalPages - 3);
      }

      if (start > 2) {
        pages.push(-1); // Ellipsis indicator
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push(-2); // Ellipsis indicator
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-cinebuzz-background">
      <Navigation />

      <main className="pt-6 pb-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Search and Header */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <h1 className="text-3xl font-bold text-white font-heading">Explore Movies</h1>
            <div className="relative w-full md:w-72">
              <Input
                type="text"
                placeholder="Search movies..."
                className="bg-cinebuzz-card border-cinebuzz-accent pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cinebuzz-subtitle" />
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="bg-cinebuzz-dark">
                <TabsTrigger value="all">All Movies</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="critics">Top Rated</TabsTrigger>
                <TabsTrigger value="global">New Releases</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-white">Filters:</span>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="bg-cinebuzz-card border-cinebuzz-accent w-32">
                  <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent className="bg-cinebuzz-dark text-white">
                  <SelectGroup>
                    {genres.map(genre => (
                      <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="bg-cinebuzz-card border-cinebuzz-accent w-32">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="bg-cinebuzz-dark text-white">
                  <SelectGroup>
                    {years.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="bg-cinebuzz-card border-cinebuzz-accent w-40">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent className="bg-cinebuzz-dark text-white">
                  <SelectGroup>
                    {platforms.map(platform => (
                      <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-cinebuzz-card border-cinebuzz-accent w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-cinebuzz-dark text-white">
                  <SelectGroup>
                    {sortOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div className="ml-auto">
                <div className="flex items-center">
                  <Button 
                    variant="ghost"
                    className={`p-2 ${viewMode === "grid" ? "bg-cinebuzz-accent" : "bg-transparent"}`}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4 text-white" />
                  </Button>
                  <Button 
                    variant="ghost"
                    className={`p-2 ${viewMode === "list" ? "bg-cinebuzz-accent" : "bg-transparent"}`}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active filters display */}
            <div className="flex flex-wrap gap-2">
              {selectedGenre !== "All" && (
                <Badge 
                  className="bg-cinebuzz-accent hover:bg-cinebuzz-accent/80" 
                  onClick={() => setSelectedGenre("All")}
                >
                  {selectedGenre} × 
                </Badge>
              )}
              {selectedYear !== "All" && (
                <Badge 
                  className="bg-cinebuzz-accent hover:bg-cinebuzz-accent/80" 
                  onClick={() => setSelectedYear("All")}
                >
                  {selectedYear} ×
                </Badge>
              )}
              {selectedPlatform !== "All" && (
                <Badge 
                  className="bg-cinebuzz-accent hover:bg-cinebuzz-accent/80" 
                  onClick={() => setSelectedPlatform("All")}
                >
                  {selectedPlatform} ×
                </Badge>
              )}
              {(selectedGenre !== "All" || selectedYear !== "All" || selectedPlatform !== "All") && (
                <Badge 
                  variant="outline" 
                  className="text-white border-white hover:bg-cinebuzz-card/30"
                  onClick={() => {
                    setSelectedGenre("All");
                    setSelectedYear("All");
                    setSelectedPlatform("All");
                  }}
                >
                  Clear all
                </Badge>
              )}
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-cinebuzz-subtitle">
              {isLoading ? "Loading..." : `Showing ${filteredMovies.length} of ${totalResults.toLocaleString()} movies`}
            </p>
          </div>

          {/* Movie Grid/List */}
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cinebuzz-accent"></div>
            </div>
          ) : filteredMovies.length > 0 ? (
            <div className={`grid gap-6 mb-8 ${
              viewMode === "grid" 
                ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" 
                : "grid-cols-1"
            }`}>
              {filteredMovies.map((movie, index) => (
                <MovieCard 
                  key={`${movie.id}-${index}`} 
                  movie={movie} 
                  view={viewMode} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Film className="h-16 w-16 text-cinebuzz-accent/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No movies found</h3>
              <p className="text-cinebuzz-subtitle max-w-md mx-auto">
                We couldn't find any movies matching your search or filters. Try adjusting your criteria.
              </p>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && filteredMovies.length > 0 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {getPageNumbers().map((page, index) => (
                  page < 0 ? (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={`page-${page}`}>
                      <PaginationLink 
                        href="#" 
                        isActive={page === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MoviesPage;
