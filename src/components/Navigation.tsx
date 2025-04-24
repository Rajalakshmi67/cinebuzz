import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, User, LogOut, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuthContext } from '@/context/AuthContext';
import { isAuthenticated, getCurrentUser } from '@/services/authService';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuth, user, logout } = useAuthContext();
  
  // Force re-evaluation of auth state on navigation
  const [localIsAuth, setLocalIsAuth] = useState(isAuth);
  
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      setLocalIsAuth(authStatus);
    };
    
    checkAuth();
  }, [location.pathname]);
  
  // Use localIsAuth instead of isAuth for conditional rendering
  const authStatus = localIsAuth || isAuth;

  const handleLogout = () => {
    logout();
    setLocalIsAuth(false);
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-[100]">
      <nav className="neo-blur py-4 px-4 md:px-6 shadow-lg bg-black/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-white mr-1">Cine</span>
            <span className="text-2xl font-bold text-cinebuzz-accent">Buzz</span>
          </Link>
          
          <div className="hidden md:flex ml-8 space-x-6">
            <Link 
              to="/" 
              className={`text-white transition-colors ${location.pathname === '/' ? 'text-cinebuzz-accent' : 'hover:text-cinebuzz-accent'}`}
            >
              Home
            </Link>
            <Link 
              to="/movies" 
              className={`text-white transition-colors ${location.pathname === '/movies' ? 'text-cinebuzz-accent' : 'hover:text-cinebuzz-accent'}`}
            >
              Movies
            </Link>
            <Link 
              to="/tv-shows" 
              className={`text-white transition-colors ${location.pathname === '/tv-shows' ? 'text-cinebuzz-accent' : 'hover:text-cinebuzz-accent'}`}
            >
              TV Shows
            </Link>
            <Link 
              to="/watchlist" 
              className={`text-white transition-colors ${location.pathname === '/watchlist' ? 'text-cinebuzz-accent' : 'hover:text-cinebuzz-accent'}`}
            >
              Watchlist
            </Link>
              <Link 
                to="/community" 
                className={`text-white transition-colors flex items-center ${location.pathname === '/community' ? 'text-cinebuzz-accent' : 'hover:text-cinebuzz-accent'}`}
              >
                <Users className="h-4 w-4 mr-1" />
                Community
              </Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {authStatus ? (
            <>
              <Link to="/profile">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:text-cinebuzz-accent transition-colors hidden md:flex"
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>
                
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="text-white hover:text-cinebuzz-accent transition-colors hidden md:flex"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <div className="hidden md:flex space-x-2">
              <Link to="/signin">
                <Button 
                  variant="outline" 
                  className="bg-transparent border-cinebuzz-accent text-cinebuzz-accent hover:bg-cinebuzz-accent hover:text-white transition-colors"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button 
                  className="bg-cinebuzz-accent text-white hover:bg-cinebuzz-accent/80"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white hover:text-cinebuzz-accent transition-colors md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute left-0 right-0 bg-cinebuzz-dark py-4 px-4 animate-slide-in z-40">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`transition-colors py-2 border-b border-gray-800 ${location.pathname === '/' ? 'text-cinebuzz-accent' : 'text-white hover:text-cinebuzz-accent'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/movies" 
              className={`transition-colors py-2 border-b border-gray-800 ${location.pathname === '/movies' ? 'text-cinebuzz-accent' : 'text-white hover:text-cinebuzz-accent'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Movies
            </Link>
            <Link 
              to="/tv-shows" 
              className={`transition-colors py-2 border-b border-gray-800 ${location.pathname === '/tv-shows' ? 'text-cinebuzz-accent' : 'text-white hover:text-cinebuzz-accent'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              TV Shows
            </Link>
            <Link 
              to="/watchlist" 
              className={`transition-colors py-2 border-b border-gray-800 ${location.pathname === '/watchlist' ? 'text-cinebuzz-accent' : 'text-white hover:text-cinebuzz-accent'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Watchlist
            </Link>
            <Link 
              to="/community" 
              className={`transition-colors py-2 border-b border-gray-800 flex items-center ${location.pathname === '/community' ? 'text-cinebuzz-accent' : 'text-white hover:text-cinebuzz-accent'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Users className="h-4 w-4 mr-1" />
              Community
            </Link>
            
            {authStatus ? (
              <>
            <Link 
              to="/profile" 
              className={`transition-colors py-2 border-b border-gray-800 ${location.pathname === '/profile' ? 'text-cinebuzz-accent' : 'text-white hover:text-cinebuzz-accent'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
                <Button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-cinebuzz-accent text-white hover:bg-cinebuzz-accent/90"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link 
                  to="/signin" 
                  className={`transition-colors py-2 border-b border-gray-800 ${location.pathname === '/signin' ? 'text-cinebuzz-accent' : 'text-white hover:text-cinebuzz-accent'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                >
            <Button className="w-full bg-cinebuzz-accent text-white hover:bg-cinebuzz-accent/90">
                    Sign Up
            </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;
