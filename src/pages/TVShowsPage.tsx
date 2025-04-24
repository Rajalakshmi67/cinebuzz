import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { tvShows } from '@/utils/tvShowsData';
import { TVShow } from '@/utils/tvShowData';
import TVShowCard from '@/components/TVShowCard';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Search, Layout, Grid, Star } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { 
  getPopularTMDBTVShows,
  getTopRatedTMDBTVShows,
  searchTMDBTVShows,
  getAiringTodayTMDBTVShows,
  getTVGenres
} from '@/services/tmdbTVService';

const TVShowsPage: React.FC = () => {
  const [allShows, setAllShows] = useState<TVShow[]>([]);
  const [filteredShows, setFilteredShows] = useState<TVShow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<string>("grid");
  const [activeStatus, setActiveStatus] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [genres, setGenres] = useState<string[]>(["All"]);
  const [genreMap, setGenreMap] = useState<{[key: string]: number}>({});
  const [activeTab, setActiveTab] = useState<string>("popular");

  const statuses = ["All", "Returning Series", "Ended", "Upcoming"];
  const ITEMS_PER_PAGE = 20;

  // Fetch genres from TMDB
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreData = await getTVGenres();
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

  // Load TV shows based on active tab
  useEffect(() => {
    const fetchTVShows = async () => {
      setIsLoading(true);
      try {
        let tmdbShows: TVShow[] = [];
        
        // Load data based on the active tab
        switch (activeTab) {
          case "popular":
            tmdbShows = await getPopularTMDBTVShows(currentPage);
            break;
          case "topRated":
            tmdbShows = await getTopRatedTMDBTVShows(currentPage);
            break;
          case "onAir":
            tmdbShows = await getAiringTodayTMDBTVShows(currentPage);
            break;
          default:
            tmdbShows = await getPopularTMDBTVShows(currentPage);
        }
        
        // Combine TMDB shows with local shows for the first page
        let combinedShows = [...tmdbShows];
        if (currentPage === 1) {
          // Map local tvShows to match the TVShow interface
          const localShows = tvShows.map(show => ({
            id: show.id,
            title: show.title,
            posterUrl: show.poster,
            backdropUrl: "",
            year: show.year,
            rating: show.rating,
            seasons: show.seasons,
            episodes: show.episodes,
            genre: show.genre,
            cast: [],
            plot: show.synopsis,
            status: show.status,
            platforms: show.platform.map(p => ({
              name: p,
              logo: "",
              url: ""
            })),
            trailerUrl: ""
          }));
          
          // Deduplicate by title
          const seenTitles = new Set<string>();
          combinedShows.forEach(show => seenTitles.add(show.title));
          
          localShows.forEach(show => {
            if (!seenTitles.has(show.title)) {
              combinedShows.push(show);
              seenTitles.add(show.title);
            }
          });
        }
        
        setAllShows(combinedShows);
        setTotalPages(20); // TMDB has many pages, but we'll limit to 20
      } catch (error) {
        console.error("Error fetching TV shows:", error);
        setAllShows([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    // If we have a search query, use search instead
    const searchTVShows = async () => {
      setIsLoading(true);
      try {
        const result = await searchTMDBTVShows(searchQuery, currentPage);
        setAllShows(result.shows);
        setTotalPages(Math.min(result.totalPages, 20)); // Limit to 20 pages
      } catch (error) {
        console.error("Error searching TV shows:", error);
        setAllShows([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (searchQuery) {
      searchTVShows();
    } else {
      fetchTVShows();
    }
  }, [activeTab, currentPage, searchQuery]);

  // Apply filters to the fetched shows
  useEffect(() => {
    let filtered = [...allShows];
    
    // Filter by genre
    if (activeGenre !== "All") {
      filtered = filtered.filter(show => 
        show.genre.some(g => g === activeGenre || g.includes(activeGenre))
      );
    }
    
    // Filter by status
    if (activeStatus !== "All") {
      filtered = filtered.filter(show => show.status === activeStatus);
    }
    
    setFilteredShows(filtered);
  }, [allShows, activeGenre, activeStatus]);

  // Handle search input with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        setCurrentPage(1); // Reset to page 1 for new searches
      }
    }, 500);
    
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleGenreChange = (value: string) => {
    setActiveGenre(value);
  };

  const handleStatusChange = (value: string) => {
    setActiveStatus(value);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchQuery("");
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
    <div className="min-h-screen bg-cinebuzz-background text-white pb-16">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Popular TV Shows</h1>
          <p className="text-cinebuzz-subtitle text-lg">
            Discover the most trending and critically acclaimed TV shows across different languages!
          </p>
        </motion.div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cinebuzz-subtitle" size={18} />
              <Input
                type="text"
                placeholder="Search shows, genres..."
                className="pl-10 bg-cinebuzz-card border-none text-white placeholder:text-cinebuzz-subtitle"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-cinebuzz-subtitle">View:</span>
              <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)}>
                <ToggleGroupItem value="grid" aria-label="Grid View">
                  <Grid className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="List View">
                  <Layout className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          {/* TV Show Categories */}
          <div className="mb-6">
            <div className="flex overflow-x-auto space-x-2 pb-2">
              <button 
                className={`px-4 py-2 rounded-full whitespace-nowrap ${activeTab === 'popular' ? 'bg-cinebuzz-accent text-white' : 'bg-cinebuzz-card text-white'}`}
                onClick={() => handleTabChange('popular')}
              >
                Popular
              </button>
              <button 
                className={`px-4 py-2 rounded-full whitespace-nowrap ${activeTab === 'topRated' ? 'bg-cinebuzz-accent text-white' : 'bg-cinebuzz-card text-white'}`}
                onClick={() => handleTabChange('topRated')}
              >
                Top Rated
              </button>
              <button 
                className={`px-4 py-2 rounded-full whitespace-nowrap ${activeTab === 'onAir' ? 'bg-cinebuzz-accent text-white' : 'bg-cinebuzz-card text-white'}`}
                onClick={() => handleTabChange('onAir')}
              >
                On Air
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Genres</h3>
            <RadioGroup 
              className="flex flex-wrap gap-2" 
              defaultValue={activeGenre}
              onValueChange={handleGenreChange}
            >
              {genres.map((genre) => (
                <div key={genre} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={genre} 
                    id={`genre-${genre}`} 
                    className="peer sr-only" 
                  />
                  <label
                    htmlFor={`genre-${genre}`}
                    className="flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-full bg-cinebuzz-card border border-transparent peer-data-[state=checked]:bg-cinebuzz-accent peer-data-[state=checked]:text-white cursor-pointer hover:bg-cinebuzz-dark transition-colors"
                  >
                    {genre}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Status</h3>
            <RadioGroup 
              className="flex flex-wrap gap-2" 
              defaultValue={activeStatus}
              onValueChange={handleStatusChange}
            >
              {statuses.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={status} 
                    id={`status-${status}`} 
                    className="peer sr-only" 
                  />
                  <label
                    htmlFor={`status-${status}`}
                    className="flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-full bg-cinebuzz-card border border-transparent peer-data-[state=checked]:bg-cinebuzz-accent peer-data-[state=checked]:text-white cursor-pointer hover:bg-cinebuzz-dark transition-colors"
                  >
                    {status}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cinebuzz-accent"></div>
          </div>
        ) : filteredShows.length > 0 ? (
          <div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  {filteredShows.map(show => (
                    <TVShowCard key={`${show.id}-${show.title}`} show={show} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredShows.map(show => (
                    <div 
                      key={`${show.id}-${show.title}`} 
                      className="flex bg-cinebuzz-card p-3 rounded-lg hover:bg-cinebuzz-dark/70 transition-colors"
                    >
                      <img 
                        src={show.posterUrl} 
                        alt={show.title} 
                        className="w-20 h-28 object-cover rounded-md mr-4 flex-shrink-0"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=200&auto=format&fit=crop';
                          target.onerror = null;
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-white truncate">{show.title}</h3>
                          <div className="flex items-center bg-cinebuzz-dark px-2 py-0.5 rounded flex-shrink-0">
                            <Star className="h-3 w-3 text-cinebuzz-yellow mr-1" />
                            <span className="text-xs">{show.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-cinebuzz-subtitle mt-1">
                          <span>{show.year}</span>
                          {show.seasons > 0 && (
                            <>
                              <span className="mx-2">•</span>
                              <span>S{show.seasons} ({show.episodes} Eps)</span>
                            </>
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {show.genre.map((genre, idx) => (
                            <span 
                              key={idx} 
                              className="text-xs bg-cinebuzz-background/70 px-2 py-0.5 rounded"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-cinebuzz-subtitle mt-2 line-clamp-2">
                          {show.plot}
                        </p>
                        <div className="mt-2 flex gap-1">
                          {show.platforms.map((platform, idx) => (
                            <span 
                              key={idx} 
                              className="text-xs bg-cinebuzz-accent/20 text-cinebuzz-accent px-2 py-0.5 rounded-full"
                            >
                              {platform.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Pagination */}
            <div className="mt-8">
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
            </div>
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-xl text-cinebuzz-subtitle">No TV shows found matching your criteria</p>
            <button 
              onClick={() => {
                setActiveGenre("All");
                setActiveStatus("All");
                setSearchQuery("");
                setCurrentPage(1);
              }} 
              className="mt-4 px-4 py-2 bg-cinebuzz-accent text-white rounded-md hover:bg-cinebuzz-accent/80 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default TVShowsPage;
