import axios from 'axios';
import { getToken } from './authService';

const API_URL = 'http://localhost:5000/api/watchlist';
const STORAGE_KEY = 'cinebuzz_watchlist';

export interface WatchlistItem {
  id: string;
  title: string;
  poster: string;
  type: 'movie' | 'tv';
  addedAt: string;
  rating?: number;
  releaseDate?: string;
}

// Default mock data for development/demo purposes
const defaultMockWatchlistData: WatchlistItem[] = [
  {
    id: '1',
    title: 'Inception',
    poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    type: 'movie',
    addedAt: '2023-05-15T14:30:00Z',
    rating: 8.8,
    releaseDate: '2010-07-16'
  },
  {
    id: '2',
    title: 'The Shawshank Redemption',
    poster: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    type: 'movie',
    addedAt: '2023-05-10T09:15:00Z',
    rating: 9.3,
    releaseDate: '1994-09-23'
  },
  {
    id: '3',
    title: 'Stranger Things',
    poster: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
    type: 'tv',
    addedAt: '2023-05-12T20:45:00Z',
    rating: 8.7,
    releaseDate: '2016-07-15'
  },
  {
    id: '4',
    title: 'Breaking Bad',
    poster: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    type: 'tv',
    addedAt: '2023-05-08T16:20:00Z',
    rating: 9.5,
    releaseDate: '2008-01-20'
  }
];

// Get initial mock data from localStorage or use default if none exists
const getInitialWatchlistData = (): WatchlistItem[] => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch (error) {
      console.error('Error parsing watchlist data from localStorage:', error);
      return defaultMockWatchlistData;
    }
  }
  return defaultMockWatchlistData;
};

// Initialize the watchlist data
let mockWatchlistData: WatchlistItem[] = getInitialWatchlistData();

// Save watchlist data to localStorage
const saveWatchlistData = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockWatchlistData));
};

// Get the user's watchlist
export const getWatchlist = async (): Promise<WatchlistItem[]> => {
  // For development/demo, return mock data from localStorage
  // In a real app, this would make an API call to fetch the user's watchlist
  return mockWatchlistData;
};

// Add an item to the watchlist
export const addToWatchlist = async (item: Omit<WatchlistItem, 'addedAt'>): Promise<WatchlistItem> => {
  // For development/demo, add to localStorage
  // In a real app, this would make an API call to add the item to the user's watchlist
  const newItem: WatchlistItem = {
    ...item,
    addedAt: new Date().toISOString()
  };
  
  // Check if item already exists to prevent duplicates
  const exists = mockWatchlistData.some(watchlistItem => watchlistItem.id === item.id);
  
  if (!exists) {
    mockWatchlistData = [...mockWatchlistData, newItem];
    saveWatchlistData();
  }
  
  return newItem;
};

// Remove an item from the watchlist
export const removeFromWatchlist = async (itemId: string): Promise<boolean> => {
  // For development/demo, remove from localStorage
  // In a real app, this would make an API call to remove the item from the user's watchlist
  const initialLength = mockWatchlistData.length;
  mockWatchlistData = mockWatchlistData.filter(item => item.id !== itemId);
  
  // Only save if something was actually removed
  if (initialLength !== mockWatchlistData.length) {
    saveWatchlistData();
    return true;
  }
  
  return false;
};

// Check if an item is in the watchlist
export const isInWatchlist = async (itemId: string): Promise<boolean> => {
  // For development/demo, check the mock data
  // In a real app, this would make an API call to check if the item is in the user's watchlist
  return mockWatchlistData.some(item => item.id === itemId);
}; 