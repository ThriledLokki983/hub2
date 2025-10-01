import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { DEVELOPMENT } from 'configs/constants';

interface QueryProviderProps {
  children: ReactNode;
}

// Create a client with optimized configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false, // Disable refetching on window focus for better UX
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
  },
});

/**
 * Provides React Query context to the application
 * Includes React Query Devtools in development mode
 */
export const QueryProvider = ({ children }: QueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {DEVELOPMENT && <ReactQueryDevtools initialIsOpen={false} position="bottom" />}
    </QueryClientProvider>
  );
};

export default QueryProvider;
