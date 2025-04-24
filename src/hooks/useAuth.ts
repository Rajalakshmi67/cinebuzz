import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signup,
  signin,
  logout,
  getCurrentUser,
  isAuthenticated,
  UserData,
  AuthResponse
} from '@/services/authService';

interface UseAuthReturn {
  user: any;
  isAuth: boolean;
  loading: boolean;
  signin: (userData: UserData) => Promise<AuthResponse>;
  signup: (userData: UserData) => Promise<AuthResponse>;
  logout: () => void;
  error: string | null;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<any>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = () => {
      try {
        const isAuth = isAuthenticated();
        const currentUser = getCurrentUser();
        
        setIsAuth(isAuth);
        setUser(currentUser);
        setLoading(false);
      } catch (error) {
        setError('Authentication check failed');
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Sign in handler
  const handleSignIn = async (userData: UserData): Promise<AuthResponse> => {
    setError(null);
    setLoading(true);
    try {
      const response = await signin(userData);
      setUser(response.user);
      setIsAuth(true);
      return response;
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || 'An error occurred during sign in');
      throw err;
    }
  };

  // Sign up handler
  const handleSignUp = async (userData: UserData): Promise<AuthResponse> => {
    setError(null);
    setLoading(true);
    try {
      const response = await signup(userData);
      setUser(response.user);
      setIsAuth(true);
      return response;
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || 'An error occurred during sign up');
      throw err;
    }
  };

  // Logout handler
  const handleLogout = () => {
    logout();
    setUser(null);
    setIsAuth(false);
    navigate('/signin');
  };

  return {
    user,
    isAuth,
    loading,
    signin: handleSignIn,
    signup: handleSignUp,
    logout: handleLogout,
    error
  };
}; 