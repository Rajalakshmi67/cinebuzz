import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export interface UserData {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    profileImage: string;
    createdAt: string;
  };
}

// Register user
export const signup = async (userData: UserData): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/signup`, userData);
  
  if (response.data.success) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Login user
export const signin = async (userData: UserData): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/signin`, userData);
  
  if (response.data.success) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Logout user
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = (): any => {
  const userString = localStorage.getItem('user');
  if (!userString) return null;
  
  return JSON.parse(userString);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('token') !== null;
};

// Get auth token
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Set auth header for axios requests
export const setAuthToken = (token: string | null): void => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
}; 