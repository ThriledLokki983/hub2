import React, { createContext, useContext, useState, useEffect } from 'react';

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  bio?: string;
}

// Auth context interface
interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  login: async () => { },
  signup: async () => { },
  logout: async () => { },
  resetPassword: async () => { },
  updateUserProfile: async () => { },
  clearError: () => { },
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on app initialization
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // In a real app, you'd check for stored tokens and validate them
        const storedUser = localStorage.getItem('cosmic_recipe_user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setCurrentUser(user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Clear any error messages
  const clearError = () => {
    setError(null);
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      clearError();

      // For demo purposes, we'll simulate a successful login
      // In a real app, you'd make an API call to your auth endpoint
      if (email && password) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock user data
        const user: User = {
          id: 'user_' + Date.now(),
          name: email.split('@')[0],
          email,
          profilePicture: 'https://via.placeholder.com/150',
        };

        // Store user in local storage (in a real app, you'd store tokens)
        localStorage.setItem('cosmic_recipe_user', JSON.stringify(user));

        setCurrentUser(user);
        setIsAuthenticated(true);
      } else {
        throw new Error('Email and password are required');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      clearError();

      // For demo purposes, we'll simulate a successful registration
      if (name && email && password) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock user data
        const user: User = {
          id: 'user_' + Date.now(),
          name,
          email,
          profilePicture: 'https://via.placeholder.com/150',
        };

        // Store user in local storage (in a real app, you'd store tokens)
        localStorage.setItem('cosmic_recipe_user', JSON.stringify(user));

        setCurrentUser(user);
        setIsAuthenticated(true);
      } else {
        throw new Error('All fields are required');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);

      // Remove from local storage
      localStorage.removeItem('cosmic_recipe_user');

      setCurrentUser(null);
      setIsAuthenticated(false);
    } catch (err: any) {
      setError(err.message || 'Failed to logout');
    } finally {
      setLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      clearError();

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, you'd send a request to your API to initiate a password reset
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  // Update user profile function
  const updateUserProfile = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      clearError();

      // For demo purposes, we'll simulate a successful profile update
      if (currentUser) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const updatedUser = {
          ...currentUser,
          ...userData
        };

        // Update local storage
        localStorage.setItem('cosmic_recipe_user', JSON.stringify(updatedUser));

        setCurrentUser(updatedUser);
      } else {
        throw new Error('No user logged in');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    login,
    signup,
    logout,
    resetPassword,
    updateUserProfile,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
