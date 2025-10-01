import axios, { InternalAxiosRequestConfig } from 'axios';
import { API_URL } from 'configs/constants';

// Create the axios instance
export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Extract token with better error handling
    let token = null;

    // Try localStorage first
    try {
      token = localStorage.getItem('Authorization');
    } catch (e) {
      console.warn('Failed to access localStorage:', e);
    }

    // Try sessionStorage if localStorage failed
    if (!token) {
      try {
        token = sessionStorage.getItem('Authorization');
      } catch (e) {
        console.warn('Failed to access sessionStorage:', e);
      }
    }

    // Try cookies as last resort
    if (!token) {
      try {
        token = document.cookie
          .split(';')
          .find(c => c.trim().startsWith('Authorization='))
          ?.split('=')[1];
      } catch (e) {
        console.warn('Failed to access cookies:', e);
      }
    }

    if (token) {
      config.headers = config.headers || {};
      // Only add Bearer prefix if it doesn't already have one
      const authValue = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      config.headers.Authorization = authValue;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // Handle 401 errors globally
    if (error.response?.status === 401) {
      // Prevent redirect loops - don't redirect if already on login or auth pages
      const isLoginPage =
        window.location.pathname === '/auth/login' || window.location.pathname.startsWith('/auth');

      if (!isLoginPage) {
        // Clear any stored auth tokens
        localStorage.removeItem('Authorization');
        sessionStorage.removeItem('Authorization');
        document.cookie = 'Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        // Store current path to redirect back after login
        const currentPath = window.location.pathname;
        if (currentPath !== '/logout') {
          sessionStorage.setItem('returnUrl', currentPath);
        }

        // Redirect to login page
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
