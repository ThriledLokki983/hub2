import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';

/**
 * A hook that ensures authentication data is loaded before executing dependent queries
 * @param queryKey The React Query key
 * @param queryFn The function that fetches data
 * @param options Additional React Query options
 * @param requireAuth Whether the query requires the user to be authenticated
 * @returns Query result that waits for auth to be loaded
 */
export function useAuthenticatedQuery<TData, TError = Error>(
  queryKey: unknown[],
  queryFn: () => Promise<TData>,
  options?: UseQueryOptions<TData, TError>,
  requireAuth: boolean = false
): UseQueryResult<TData, TError> {
  const { isAuthenticated, loading: authLoading } = useAuth();

  return useQuery<TData, TError>({
    queryKey,
    queryFn,
    ...options,
    // Only run the query if:
    // 1. Auth loading has completed AND
    // 2. Either authentication is not required OR user is authenticated
    enabled:
      (!authLoading) &&
      (!requireAuth || isAuthenticated) &&
      (options?.enabled !== false),
    // Don't retry for unauthorized errors when not authenticated
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401 && !isAuthenticated) {
        return false;
      }
      if (error?.response?.status === 404 && error?.response?.data?.message?.includes("Authorization token missing")) {
        return false;
      }
      // Use default retry behavior for other cases
      return failureCount < 3;
    }
  });
}

/**
 * A hook specifically for queries that require authentication
 */
export function useProtectedQuery<TData, TError = Error>(
  queryKey: unknown[],
  queryFn: () => Promise<TData>,
  options?: UseQueryOptions<TData, TError>
): UseQueryResult<TData, TError> {
  return useAuthenticatedQuery(queryKey, queryFn, options, true);
}