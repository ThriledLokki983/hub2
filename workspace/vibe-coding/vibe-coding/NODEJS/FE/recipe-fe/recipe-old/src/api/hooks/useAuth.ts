import { useCallback, useContext } from 'react';
import AuthContext from '../../contexts/AuthContext';
import { LoginCredentials, SignupData } from '../services/authService';
import { getCookie } from 'react-use-cookie';

// Default auth state for when context is not available
const defaultAuthState = {
  currentUser: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  login: async () => { throw new Error('AuthProvider not initialized'); },
  signup: async () => { throw new Error('AuthProvider not initialized'); },
  logout: async () => { throw new Error('AuthProvider not initialized'); },
  clearError: () => {}
};

// Hook for accessing authentication functionality throughout the app
export const useAuth = () => {
  const context = useContext(AuthContext);

  // Use default state when outside AuthProvider instead of throwing
  // This allows hooks to work during initialization
  if (!context) {
    console.warn('useAuth called outside of AuthProvider. Using default state.');
    return {
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,
      checkHasToken: () => false,
      login: async () => { throw new Error('AuthProvider not initialized'); },
      signup: async () => { throw new Error('AuthProvider not initialized'); },
      logout: async () => { throw new Error('AuthProvider not initialized'); },
      clearError: () => {}
    };
  }

  const {
    currentUser,
    isAuthenticated,
    loading: isLoading,
    error,
    login: contextLogin,
    signup: contextSignup,
    logout,
    clearError
  } = context;

  // Check if token exists in cookies
  const checkHasToken = useCallback(() => {
    const token = getCookie('Authorization');
		console.log(`Token found: ${token}`);

    return !!token;
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      // Pass email and password separately as expected by contextLogin
      await contextLogin(credentials.email, credentials.password);
      return {
        user: currentUser,
        token: getCookie('Authorization') || ''
      };
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please check your credentials and try again.';
      throw new Error(errorMessage);
    }
  }, [contextLogin, currentUser]);

  // Signup function
  const signup = useCallback(async (userData: SignupData) => {
    try {
      await contextSignup(userData.name, userData.email, userData.password);
      return {
        user: currentUser,
        token: getCookie('Authorization') || ''
      };
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed. Please try again.';
      throw new Error(errorMessage);
    }
  }, [contextSignup, currentUser]);

  return {
    user: currentUser,
    isAuthenticated,
    isLoading,
    error,
    checkHasToken,
    login,
    signup,
    logout,
    clearError
  };
};