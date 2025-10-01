import apiClient from '../config';

// User interface
export interface User {
  id?: string;
  name: string;
  email: string;
}

// Auth response interface
export interface AuthResponse {
  user: User;
  token: string;
}

// Login credentials interface
export interface LoginCredentials {
  email: string;
  password: string;
}

// Signup data interface
export interface SignupData {
  name: string;
  email: string;
  password: string;
}

// Auth status response interface
export interface AuthStatusResponse {
  isAuthenticated: boolean;
  user: User | null;
}

// Cookie options for secure cookie setting
const COOKIE_OPTIONS = {
  path: '/',
  secure: window.location.protocol === 'http:',
  sameSite: 'strict',
  // Set expiration to 7 days
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()
} as const;

// Set a secure cookie
const setCookie = (name: string, value: string, options = COOKIE_OPTIONS) => {
  const optionsString = Object.entries(options)
    .map(([key, val]) => `${key}=${val}`)
    .join('; ');
  document.cookie = `${name}=${value}; ${optionsString}`;
  console.log(`Set ${name} cookie with expiration: ${options.expires}`);
};

// For development & debugging - temporary fix for token storage issues
const setLocalStorageToken = (token: string) => {
  localStorage.setItem('Authorization', token);
  console.log('Also set token in localStorage as backup');
};

// Cache for auth status
interface AuthStatusCache {
  status: AuthStatusResponse | null;
  token: string | null;
  timestamp: number;
  promise: Promise<AuthStatusResponse> | null;
}

const authStatusCache: AuthStatusCache = {
  status: null,
  token: null,
  timestamp: 0,
  promise: null
};

// Max age in milliseconds for the cached auth status (5 seconds)
const MAX_CACHE_AGE = 5000;

// Auth service class with functions for login and signup
const authService = {
  // Login user - store the token in a cookie and the backend will also set an HTTP-only cookie
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Set withCredentials to true to allow cookies to be sent with request
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials, {
      withCredentials: true
    });

    // Set the token in a cookie for the request interceptor to use
    if (response.data && response.data.token) {
      setCookie('Authorization', response.data.token);
      setLocalStorageToken(response.data.token); // Temporary fix
    }

    // Clear the auth status cache since the user just logged in
    authStatusCache.status = null;
    authStatusCache.promise = null;

    return response.data;
  },

  // Sign up new user - store the token in a cookie and the backend will also set an HTTP-only cookie
  async signup(userData: SignupData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/signup', userData, {
      withCredentials: true
    });

    // Set the token in a cookie for the request interceptor to use
    if (response.data && response.data.token) {
      setCookie('Authorization', response.data.token);
      setLocalStorageToken(response.data.token); // Temporary fix
    }

    // Clear the auth status cache since the user just signed up
    authStatusCache.status = null;
    authStatusCache.promise = null;

    return response.data;
  },

  // Logout user - this will clear both cookies
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout', {}, { withCredentials: true });

    // Clear the cookie and localStorage
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    localStorage.removeItem('Authorization');
    localStorage.removeItem('token');

    // Clear the auth status cache since the user just logged out
    authStatusCache.status = null;
    authStatusCache.promise = null;
  },

  // Generate a development test token for testing - only for development environments
  async generateTestToken(): Promise<string> {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error('Test tokens can only be generated in development environment');
    }

    try {
      // This assumes your backend has a test endpoint that returns a token
      const response = await apiClient.post<{token: string}>('/auth/generate-test-token');

      if (response.data && response.data.token) {
        setCookie('Authorization', response.data.token);
        setLocalStorageToken(response.data.token); // Temporary fix
        return response.data.token;
      }

      throw new Error('Failed to generate test token');
    } catch (error) {
      console.error('Error generating test token:', error);
      throw error;
    }
  },

  // Check authentication status and get user data in a single request with caching
  async getAuthStatus(): Promise<AuthStatusResponse> {
    const now = Date.now();
		console.log(authStatusCache);


    // If there's an in-flight request, return its promise to prevent duplicate calls
    if (authStatusCache.promise) {
      return authStatusCache.promise;
    }

    // If we have a cached result that's not too old, return it
    if (authStatusCache.status && now - authStatusCache.timestamp < MAX_CACHE_AGE) {
      return authStatusCache.status;
    }

    // Otherwise, make a new request and cache it
    try {
      // Create a promise and store it in the cache
      authStatusCache.promise = (async () => {
        try {
          // Fetch the current user profile - this should use the cookie for authentication
          const response = await apiClient.get<User>('/auth/me', {
            withCredentials: true
          });

          const result = {
            isAuthenticated: true,
            user: response.data
          };

          // Update the cache with the successful result
          authStatusCache.status = result;
          authStatusCache.timestamp = Date.now();

          return result;
        } catch (_) {
          const result = {
            isAuthenticated: false,
            user: null
          };

          // Update the cache with the failure result
          authStatusCache.status = result;
          authStatusCache.timestamp = Date.now();

          return result;
        } finally {
          // Clear the promise from the cache
          authStatusCache.promise = null;
        }
      })();

      // Return the promise from the cache
      return authStatusCache.promise;
    } catch (_) {
      return {
        isAuthenticated: false,
        user: null
      };
    }
  },

  // Legacy methods for backward compatibility
  async isAuthenticated(): Promise<boolean> {
    const { isAuthenticated } = await this.getAuthStatus();
    return isAuthenticated;
  },

  async getCurrentUser(): Promise<User | null> {
    const { user } = await this.getAuthStatus();
    return user;
  }
};

export default authService;