import { getToken } from './authService';

const REVIEWS_STORAGE_KEY = 'cinebuzz_movie_reviews';

export interface Review {
  id: string;
  movieId: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  rating: number;
  content: string;
  timestamp: string;
}

// Empty default array instead of mock data
const defaultReviews: Review[] = [];

// Helper functions for localStorage
const getStoredReviews = (): Review[] => {
  try {
    const reviewsJson = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (reviewsJson) {
      return JSON.parse(reviewsJson);
    }
  } catch (error) {
    console.error('Error reading reviews from localStorage:', error);
  }
  return defaultReviews;
};

const saveReviews = (reviews: Review[]) => {
  localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
};

// Initialize empty array if not present
if (typeof window !== 'undefined' && !localStorage.getItem(REVIEWS_STORAGE_KEY)) {
  saveReviews(defaultReviews);
}

// Review service functions
export const getMovieReviews = async (movieId: string | number): Promise<Review[]> => {
  const reviews = getStoredReviews();
  const movieIdStr = movieId.toString();
  return reviews.filter(review => review.movieId === movieIdStr);
};

export const addReview = async (review: Omit<Review, 'id' | 'timestamp'>): Promise<Review> => {
  const reviews = getStoredReviews();
  
  const newReview: Review = {
    id: `review-${Date.now()}`,
    ...review,
    timestamp: new Date().toLocaleDateString('en-US', { 
      month: 'long',
      day: 'numeric', 
      year: 'numeric' 
    })
  };
  
  const updatedReviews = [newReview, ...reviews];
  saveReviews(updatedReviews);
  
  return newReview;
};

export const deleteReview = async (reviewId: string): Promise<boolean> => {
  const reviews = getStoredReviews();
  const updatedReviews = reviews.filter(review => review.id !== reviewId);
  
  if (updatedReviews.length !== reviews.length) {
    saveReviews(updatedReviews);
    return true;
  }
  
  return false;
};

export const getUserReviews = async (userId: string): Promise<Review[]> => {
  const reviews = getStoredReviews();
  return reviews.filter(review => review.user.id === userId);
};

export const getAverageRating = async (movieId: string): Promise<number> => {
  const reviews = await getMovieReviews(movieId);
  
  if (reviews.length === 0) {
    return 0;
  }
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return parseFloat((totalRating / reviews.length).toFixed(1));
}; 