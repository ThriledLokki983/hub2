import { ReactNode } from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

interface QueryProviderProps {
  children: ReactNode;
}

// Create a client with default configuration
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

export const QueryProvider = ({ children }: QueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} position="bottom" />
    </QueryClientProvider>
  );
};

export default QueryProvider;
