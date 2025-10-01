import axios from 'axios';

// You can replace this with your actual API base URL
export const API_BASE_URL = 'http://localhost:8888/api';

// Function to get token from cookies with more robust handling
export const getTokenFromCookies = (): string | null => {
  try {
    const cookies = document.cookie.split(';');
    // Try both 'authToken' and 'token' cookie names (case insensitive)
    const tokenCookie = cookies.find(cookie =>
      cookie.trim().toLowerCase().startsWith('authtoken=') ||
      cookie.trim().toLowerCase().startsWith('token=') ||
      cookie.trim().toLowerCase().startsWith('authorization=')
    );

    console.log(cookies);


    if (tokenCookie) {
      const value = tokenCookie.split('=')[1];
      console.log('Found token in cookies:', value ? value.substring(0, 10) + '...' : 'empty');
      return value;
    }

    // Try localStorage as a fallback (for backward compatibility)
    // This is just temporary until all token handling is migrated to cookies
    const localToken = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (localToken) {
      console.log('Found token in localStorage (fallback)');
      return localToken;
    }

    console.warn('No auth token found in cookies or localStorage');
    return null;
  } catch (e) {
    console.error('Error retrieving token from cookies:', e);
    return null;
  }
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Enable cookies with all requests by default
  withCredentials: true,
});

// Request interceptor to add auth token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = getTokenFromCookies();
    if (token) {
      // Set the token in the Authorization header with Bearer prefix
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`Setting Authorization header for ${config.url}`);
    } else {
      console.log(`No token available for request to ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle unauthorized errors (expired token, etc.)
    if (error.response && error.response.status === 401) {
      // The user is no longer authenticated
      console.log('401 Unauthorized error detected');
    }

    // Handle "Authorization token missing" errors specifically
    if (error.response &&
        error.response.status === 404 &&
        error.response.data?.message?.includes('Authorization token missing')) {
      console.error('API requires authorization but no token was provided');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
