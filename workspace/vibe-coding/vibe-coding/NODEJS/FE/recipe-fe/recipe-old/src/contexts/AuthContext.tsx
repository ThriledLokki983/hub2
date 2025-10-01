import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { User } from '../api/services/authService';

// Interface for the auth context
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props interface for the AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Clear error helper function
  const clearError = () => setError(null);

  // Check for existing user session on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Get authentication status and user data in a single API call
        const { isAuthenticated, user } = await authService.getAuthStatus();

        setCurrentUser(user);
        setIsAuthenticated(isAuthenticated);
      } catch (err) {
        setCurrentUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login({ email, password });

      // The token is now stored in a cookie by the authService
      // and will be used in the Authorization header
      setCurrentUser(response.user);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.signup({ name, email, password });

      // The token is now stored in a cookie by the authService
      // and will be used in the Authorization header
      setCurrentUser(response.user);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to sign up. Please try again.');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Logout function - now async to call the logout endpoint
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
  };

  // Context value
  const value = {
    currentUser,
    loading,
    error,
    isAuthenticated,
    login,
    signup,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;