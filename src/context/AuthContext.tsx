import React, { createContext, ReactNode, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserData, AuthResponse } from '@/services/authService';

interface AuthContextType {
  user: any;
  isAuth: boolean;
  loading: boolean;
  signin: (userData: UserData) => Promise<AuthResponse>;
  signup: (userData: UserData) => Promise<AuthResponse>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}; 