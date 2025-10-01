import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { ApiEndpointInterface } from 'configs/interfaces';
import { ConnectOptions, ApiResult } from 'hooks/interfaces';
import useApi from './useApi';

/**
 * A hook for making GET requests with React Query's powerful caching and state management
 */
export function useQueryApi<T, E = Error>(
  apiConfig: ApiEndpointInterface,
  payload: Record<string, any> | null = null,
  options: ConnectOptions & Omit<UseQueryOptions<ApiResult<T>, E, ApiResult<T>>, 'queryKey' | 'queryFn'> = {}
) {
  const api = useApi<T>(apiConfig);
  const queryKey = [apiConfig.endpoint, payload ? JSON.stringify(payload) : null];

  return useQuery<ApiResult<T>, E, ApiResult<T>>({
    queryKey,
    queryFn: () => api.get(payload, { silent: true }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
}

/**
 * A hook for making mutation requests (POST, PUT, PATCH, DELETE) with React Query
 */
export function useMutationApi<T, E = Error>(
  apiConfig: ApiEndpointInterface,
  options: ConnectOptions & Omit<UseMutationOptions<ApiResult<T>, E, Record<string, any> | null>, 'mutationFn'> = {}
) {
  const api = useApi<T>(apiConfig);
  const queryClient = useQueryClient();

  const mutationFn = async (payload: Record<string, any> | null) => {
    switch (apiConfig.method.toUpperCase()) {
      case 'POST':
        return api.post(payload, { silent: true });
      case 'PUT':
        return api.put(payload, { silent: true });
      case 'PATCH':
        return api.patch(payload, { silent: true });
      case 'DELETE':
        return api.delete(payload, { silent: true });
      default:
        throw new Error(`Invalid method for mutation: ${apiConfig.method}`);
    }
  };

  return useMutation<ApiResult<T>, E, Record<string, any> | null>({
    mutationFn,
    ...options,
    onSuccess: (data, variables, context) => {
      // By default, invalidate queries to the same endpoint
      // This can be overridden by passing onSuccess in options
      queryClient.invalidateQueries({ queryKey: [apiConfig.endpoint] });
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
  });
}

/**
 * A hook for prefetching data that might be needed soon
 */
export function usePrefetchQuery<T>(
  apiConfig: ApiEndpointInterface,
  payload: Record<string, any> | null = null
) {
  const queryClient = useQueryClient();
  const api = useApi<T>(apiConfig);

  return async () => {
    if (apiConfig.method.toUpperCase() === 'GET') {
      const queryKey = [apiConfig.endpoint, payload ? JSON.stringify(payload) : null];
      await queryClient.prefetchQuery({
        queryKey,
        queryFn: () => api.get(payload, { silent: true }),
        staleTime: 1000 * 60 * 5, // 5 minutes
      });
    }
  };
}
