import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import {
  API_URL,
  CSRF_TOKEN,
  HTTP_CODES_UNAUTHORIZED,
  DEVELOPMENT
} from 'configs/constants';

import { ApiEndpointInterface } from 'configs/interfaces';
import {
  ApiResult,
  ErrorResponse,
  ConnectOptions,
  ConnectInterface,
} from 'hooks/interfaces';
import { useAppStateContext } from 'contexts';

/**
 * Enhanced API hook using React Query for robust data fetching
 * with built-in caching, retrying, and state management.
 */
const useApi = <T>({ endpoint, method, json: parseJson = true }: ApiEndpointInterface): {
  delete: ConnectInterface<T>;
  get: ConnectInterface<T>;
  patch: ConnectInterface<T>;
  post: ConnectInterface<T>;
  put: ConnectInterface<T>;
} => {
  const queryClient = useQueryClient();
  const { stateDispatch: updateAppState, showError } = useAppStateContext();

  /**
   * Error message fallback helper.
   */
  const getErrorMessage = (response: ErrorResponse) => response.message
    || response.statusText
    || (response.status === 500 ? 'Internal Server Error' : 'Unknown');

  /**
   * Constructs a proper API URL by correctly joining path segments
   */
  const buildApiUrl = (path: string): string => {
    if (!API_URL) return path; // If API_URL is empty, use relative path

    // Normalize path by removing leading slash if present
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;

    // Ensure API_URL doesn't end with a slash
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;

    return `${baseUrl}/${cleanPath}`;
  };

  /**
   * Generic fetch function that handles different HTTP methods
   */
  const fetchData = async (
    url: string,
    method: string,
    payload: Record<string, any> | null,
    options: ConnectOptions = {}
  ): Promise<ApiResult<T>> => {
    const { silent = false, throwError = true } = options;

    // Set loading state if not silent
    if (!silent) {
      updateAppState({
        type: "UPDATE_STATE_FETCHING",
        payload: { isFetching: true }
      });
    }

    try {
      // Build API URL and add query parameters if needed
      let fullUrl = buildApiUrl(url);

      if (payload && method.toUpperCase() === 'GET') {
        const searchParams = new URLSearchParams(payload);
        fullUrl = `${fullUrl}?${searchParams.toString()}`;
      }

      console.log('Making API request to:', fullUrl);

      // Set up headers based on environment
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      // Only include CSRF token in production environment
      // This helps avoid CORS issues during local development
      if (!DEVELOPMENT && CSRF_TOKEN) {
        headers['X-CSRFToken'] = CSRF_TOKEN;
      }

      const response = await fetch(fullUrl, {
        method,
        credentials: 'include',
        headers,
        body: payload && method.toUpperCase() !== 'GET'
          ? JSON.stringify(payload)
          : null,
      });

      // Process response
      const code = response.status;
      const message = getErrorMessage(response);

      // Handle successful responses
      if (response.ok) {
        const data = parseJson ? await response.json() : response;
        return {
          status: 'success',
          data,
          code,
          message,
          loading: false,
          error: ''
        };
      }

      // Handle unauthorized errors
      if (HTTP_CODES_UNAUTHORIZED.includes(code)) {
        if (throwError) {
          showError({
            active: true,
            title: `Not authorized`,
            message: `We were unable to authenticate you, please login again.`,
          });
        }
      }
      // Handle JSON error responses
      else if (parseJson) {
        try {
          const json = await response.json();
          const messageUpdated = json?.errors?.[0]?.message || message;
          if (throwError) {
            showError({
              active: true,
              message: `Error: ${messageUpdated} (${code})`,
            });
          }
        } catch (jsonError) {
          if (throwError) {
            showError({
              active: true,
              message: `Error: ${jsonError instanceof Error ? jsonError.message : String(jsonError)} (${code})`,
            });
          }
        }
      }
      // Handle everything else
      else if (throwError) {
        showError({
          active: true,
          message: `Error: ${message} (${code})`,
        });
      }

      throw new Error(`API error: ${message}`);
    } catch (error) {
      if (!silent && throwError) {
        showError({
          active: true,
          title: `Unable to connect to server`,
          message: `Error: ${error instanceof Error ? error.message : String(error)}`,
        });
      }
      return {
        status: 'error',
        data: [] as unknown as T,
        message: error instanceof Error ? error.message : String(error),
        loading: false,
        error: error instanceof Error ? error.message : String(error)
      };
    } finally {
      if (!silent) {
        updateAppState({
          type: "UPDATE_STATE_FETCHING",
          payload: { isFetching: false }
        });
      }
    }
  };

  /**
   * Shared wrapper for all HTTP methods
   */
  const connect = useCallback((
    payload: Record<string, any> | null,
    options: ConnectOptions = {}
  ) => {
    const { forced = false } = options;
    const isGetRequest = method.toUpperCase() === 'GET';
    const queryKey = isGetRequest ?
      [endpoint, payload ? JSON.stringify(payload) : null] :
      [endpoint, method, payload ? JSON.stringify(payload) : null];

    // For GET requests, use useQuery (cache-first)
    if (isGetRequest) {
      // Invalidate query if forced
      if (forced) {
        queryClient.invalidateQueries({ queryKey });
      }

      return fetchData(endpoint, method, payload, options);
    }

    // For other methods, use direct fetch since they're typically mutation operations
    return fetchData(endpoint, method, payload, options);
  }, [endpoint, method, queryClient, fetchData]);

  return {
    delete: useCallback(connect, [connect]),
    get: useCallback(connect, [connect]),
    patch: useCallback(connect, [connect]),
    post: useCallback(connect, [connect]),
    put: useCallback(connect, [connect]),
  };
};

export default useApi;
