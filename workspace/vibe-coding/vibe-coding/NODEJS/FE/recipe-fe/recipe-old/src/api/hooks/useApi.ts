import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import apiClient from '../config';
import { useAuth } from './useAuth';
import { AxiosError, AxiosResponse } from 'axios';

// Define constants similar to your example
const HTTP_CODES_UNAUTHORIZED = [401, 403];
const USER_PROFILE_KEY = ['user', 'profile'];

// Define interfaces for the hook
interface ApiEndpointInterface {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  json?: boolean; // Whether to parse response as JSON
  cache?: boolean; // Whether to use stale cache
  url?: string; // URL to invalidate after mutation
  queryKey?: unknown[]; // Custom query key override
  isFile?: boolean; // For handling file uploads
}

interface ApiError {
  message: string;
  status: number;
  errors?: Array<{ message: string }>;
}

interface ApiResponse<T = any> {
  data?: T;
  status: number;
  message?: string;
  errors?: Array<{ message: string }>;
}

/**
 * Hook to fetch the currently authenticated user's profile
 * Uses the /me endpoint which is commonly used for this purpose
 */
export const useCurrentUser = <TData = any>(
  options?: Omit<UseQueryOptions<TData, ApiError>, 'queryKey' | 'queryFn'>
) => {
  const { isAuthenticated } = useAuth();

  return useQuery<TData, ApiError>({
    queryKey: USER_PROFILE_KEY,
    queryFn: async () => {
      try {
        const response = await apiClient.get('/me');
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        throw {
          message: axiosError.response?.data?.message || 'Failed to fetch user profile',
          status: axiosError.response?.status || 0,
          errors: axiosError.response?.data?.errors || [],
        };
      }
    },
    enabled: isAuthenticated && (options?.enabled !== false),
    staleTime: 5 * 60 * 1000, // Cache the user data for 5 minutes
    ...options,
  });
};

/**
 * Custom hook for making API requests using React Query and the configured apiClient
 */
const useApi = <TData = any, TError = ApiError>({
  endpoint,
  method,
  json = true,
  cache = false,
  url: urlToInvalidate,
  queryKey,
  isFile = false,
}: ApiEndpointInterface) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const queryClient = useQueryClient();

  // Determine if the request should be made
  const isExemptEndpoint = endpoint.includes('login') || endpoint.includes('signup');
  const shouldFetch = isExemptEndpoint || isAuthenticated;

  // Function to handle API requests
  const fetcher = async (payload?: any): Promise<TData> => {
    if (!shouldFetch) {
      return Promise.resolve({} as TData);
    }

    if (endpoint.includes('undefined')) {
      console.warn('Endpoint contains undefined value. Check your parameters.');
      return Promise.resolve({} as TData);
    }

    try {
      let response: AxiosResponse;

      // Handle different HTTP methods
      switch (method.toUpperCase()) {
        case 'GET':
          response = await apiClient.get(endpoint, { params: payload });
          break;
        case 'POST':
          response = await apiClient.post(endpoint, payload, {
            headers: isFile ? { 'Content-Type': 'multipart/form-data' } : undefined,
          });
          break;
        case 'PUT':
          response = await apiClient.put(endpoint, payload);
          break;
        case 'PATCH':
          response = await apiClient.patch(endpoint, payload);
          break;
        case 'DELETE':
          response = await apiClient.delete(endpoint, { data: payload });
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      return json ? response.data : response;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;

      // Handle different error types
      if (axiosError.response) {
        const status = axiosError.response.status;
        const errorData = axiosError.response.data as ApiError;

        if (status === 500) {
          console.error('Server error occurred:', errorData);
          navigate('/server-error');
        }

        if (HTTP_CODES_UNAUTHORIZED.includes(status)) {
          console.warn('Authentication error. Logging out...');
          logout();
        }

        throw {
          message: errorData?.message || axiosError.message,
          status: status,
          errors: errorData?.errors || [],
        };
      }

      // Network errors or other issues
      throw {
        message: axiosError.message || 'Unknown error occurred',
        status: 0,
        errors: [],
      };
    }
  };

  // Query hook for GET requests
  const useApiQuery = (
    payload?: any,
    options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
  ) => {
    const finalQueryKey = queryKey || [endpoint, payload];

    return useQuery<TData, TError>({
      queryKey: finalQueryKey,
      queryFn: () => fetcher(payload),
      enabled: method.toUpperCase() === 'GET' && shouldFetch && !(options?.enabled === false),
      staleTime: cache ? 60 * 1000 : 0, // Cache for 1 minute if enabled
      retry: (failureCount, error: any) => {
        // Don't retry for authentication errors
        if (error?.status && HTTP_CODES_UNAUTHORIZED.includes(error.status)) {
          return false;
        }
        return failureCount < 2;
      },
      ...options,
    });
  };

  // Mutation hook for non-GET requests
  const useApiMutation = () => {
    return useMutation({
      mutationFn: (payload: any) => fetcher(payload),
      onSuccess: (data, variables) => {
        // Invalidate related queries when mutation is successful
        if (urlToInvalidate) {
          const normalizedUrl = urlToInvalidate.split('?')[0];
          queryClient.invalidateQueries({ queryKey: [normalizedUrl] });
        }

        // Optionally invalidate the current endpoint as well
        queryClient.invalidateQueries({ queryKey: [endpoint] });

        // Special handling for user profile updates
        if (endpoint.includes('/me') || endpoint.includes('profile')) {
          queryClient.invalidateQueries({ queryKey: USER_PROFILE_KEY });
        }
      },
      onError: (error: any) => {
        console.error(`API Error in ${method} ${endpoint}:`, error);
      },
    });
  };

  // Return appropriate handlers based on HTTP method
  return {
    get: useApiQuery,
    post: useApiMutation,
    put: useApiMutation,
    patch: useApiMutation,
    delete: useApiMutation,
  };
};

export default useApi;