import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { ApiEndpointInterface } from 'configs/interfaces';
import { stripDoubleSlashes } from 'helpers/utils';
import { useAppStateContext } from 'contexts';
import { API_URL } from 'configs/constants';

interface ApiDataInterface<T> {
  data: {
    success: boolean;
    message: string;
    statusCode: number;
    data: T;
  };
}

/**
 * Response type for API calls
 */
export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  data: ApiDataInterface<T> | null;
  code: number;
  message: string;
}

/**
 * Options for API requests
 */
export interface ApiRequestOptions {
  silent?: boolean;
  forced?: boolean;
  throwError?: boolean;
}

/**
 * Creates an axios instance with default configuration
 */
const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      Accept: 'application/json',
    },
    withCredentials: true,
    transformRequest: [
      function (data, headers) {
        // If it's FormData, return it as is and let the browser set the correct Content-Type
        if (data instanceof FormData) {
          delete headers['Content-Type'];
          return data;
        }
        // Otherwise use the default transformation
        if (data && headers['Content-Type'] === 'application/json') {
          return JSON.stringify(data);
        }
        return data;
      },
    ],
  });

  // Request interceptor for API calls
  instance.interceptors.request.use(
    config => {
      // Add the CSRF token to the headers if it exists
      const token =
        localStorage.getItem('Authorization') ||
        sessionStorage.getItem('Authorization') ||
        document.cookie
          .split(';')
          .find(c => c.trim().startsWith('Authorization='))
          ?.split('=')[1];

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  // Response interceptor for API calls
  instance.interceptors.response.use(
    response => {
      // Store the ApiResponse format in the response.data
      const apiResponse: ApiResponse = {
        status: 'success',
        data: response.data,
        code: response.status,
        message: response.statusText,
      };

      // Maintain the AxiosResponse structure but replace the data
      response.data = apiResponse;
      return response;
    },
    error => {
      // Check if this is a server error (500 status code)
      const isServerError = error.response?.status === 500;

      // Transform error responses to match ApiResponse format
      const errorResponse: ApiResponse = {
        status: 'error',
        data: null,
        code: error.response?.status || 500,
        // For 500 errors, use a generic message instead of exposing server details
        message: isServerError
          ? 'Something went wrong with our servers. Please try again later.'
          : error.response?.data?.message || error.message || 'Unknown error',
      };

      return Promise.reject(errorResponse);
    },
  );

  return instance;
};

// Create a shared axios instance
const axiosInstance = createAxiosInstance();

interface ToastInterface {
  type: 'error' | 'success' | 'warning' | 'info';
  title: string;
  message: string;
  active: boolean;
  persistent?: boolean;
  reload?: boolean;
  button?: {
    label: string;
    url: string;
  };
}

const handleApiError = (
  error: unknown,
  showError: (toast: ToastInterface) => void,
  silent = false,
  throwError = true,
) => {
  const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
  if (!silent) {
    showError({
      type: 'error',
      title: 'Error',
      message: errorMessage,
      active: true,
      persistent: true,
    });
  }
  if (throwError) {
    throw error;
  }
  return {
    status: 'error' as const,
    data: null,
    code: error instanceof AxiosError ? error.response?.status || 500 : 500,
    message: errorMessage,
  };
};

/**
 * A hook for making GET requests with React Query's powerful caching and state management
 *
 * @template T The expected data type
 * @param endpoint The API endpoint configuration
 * @param params The payload for the request
 * @param options Additional options for the query
 * @returns React Query result object with data, loading state, error handling, etc.
 */
export const useQueryApi = <T = unknown>(
  endpoint: ApiEndpointInterface,
  params?: Record<string, unknown>,
  options?: UseQueryOptions<ApiResponse<T>> & ApiRequestOptions,
) => {
  const { showError } = useAppStateContext();
  const { silent = false, throwError = true, ...queryOptions } = options || {};

  return useQuery<ApiResponse<T>>({
    queryKey: [endpoint.endpoint, params],
    queryFn: async () => {
      try {
        const axiosInstance = createAxiosInstance();
        const response = await axiosInstance.request({
          url: stripDoubleSlashes(endpoint.endpoint),
          method: endpoint.method,
          params,
        });
        return {
          status: 'success',
          data: response.data,
          code: response.status,
          message: response.statusText,
        };
      } catch (error) {
        return handleApiError(error, showError, silent, throwError);
      }
    },
    ...queryOptions,
  });
};

/**
 * A hook for making mutation requests (POST, PUT, PATCH, DELETE) with React Query
 *
 * @template T The expected data type
 * @template E The error type (defaults to AxiosError)
 * @param apiConfig The API endpoint configuration
 * @param options Additional options for the mutation
 * @returns React Query mutation object with mutate function, loading state, etc.
 */
export function useMutationApi<T, E = AxiosError>(
  apiConfig: ApiEndpointInterface,
  options: ApiRequestOptions &
    Omit<
      UseMutationOptions<ApiResponse<T>, E, FormData | Record<string, unknown> | null>,
      'mutationFn'
    > = {},
) {
  const { showError } = useAppStateContext();
  const { silent = false, throwError = true } = options;

  // Define the mutation function
  const mutationFn = async (
    payload: FormData | Record<string, unknown> | null,
  ): Promise<ApiResponse<T>> => {
    try {
      const config: AxiosRequestConfig = {
        url: stripDoubleSlashes(apiConfig.endpoint),
        method: apiConfig.method,
        data: payload,
        headers: apiConfig.formData
          ? {
              'Content-Type': 'multipart/form-data',
            }
          : {
              'Content-Type': 'application/json',
            },
      };

      const response = await axiosInstance(config);
      return response as unknown as ApiResponse<T>;
    } catch (error: unknown) {
      return handleApiError(error, showError, silent, throwError);
    }
  };

  return useMutation<ApiResponse<T>, E, FormData | Record<string, unknown> | null>({
    mutationFn,
    ...options,
    onSuccess: (data, variables, context) => {
      // If invalidateQueries is specified in options, invalidate those queries
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
  });
}

/**
 * A hook for prefetching data that might be needed soon
 *
 * @template T The expected data type
 * @param apiConfig The API endpoint configuration
 * @param payload The payload for the request
 * @returns A function that will prefetch the data when called
 */
export function usePrefetchQuery<T>(
  apiConfig: ApiEndpointInterface,
  payload: Record<string, unknown> | null = null,
) {
  return async () => {
    if (apiConfig.method.toUpperCase() === 'GET') {
      // Construct the endpoint URL for GET requests with query params
      let finalEndpoint = apiConfig.endpoint;
      if (payload) {
        const params = new URLSearchParams();
        Object.entries(payload).forEach(([key, value]) => {
          params.append(key, String(value));
        });
        finalEndpoint = `${finalEndpoint}?${params.toString()}`;
      }

      // Define the prefetch function
      const fetchData = async (): Promise<ApiResponse<T>> => {
        const config: AxiosRequestConfig = {
          url: stripDoubleSlashes(finalEndpoint),
          method: apiConfig.method,
        };

        const response = await axiosInstance(config);
        return response as unknown as ApiResponse<T>;
      };

      // Prefetch the query
      await fetchData();
    }
  };
}
