import { QueryClient } from '@tanstack/react-query';

// Create a shared query client configuration
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Global defaults for queries
        staleTime: 1 * 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
        retry: (failureCount, error: any) => {
          // Don't retry on 4xx errors (client errors)
          if (error?.response?.status >= 400 && error?.response?.status < 500) {
            return false;
          }
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        // Global defaults for mutations
        retry: false,
        onError: (error: any) => {
          console.error('Mutation error:', error);
          // You can add global error handling here
          // For example, show a toast notification
        },
      },
    },
  });
};

// Export a default instance
export const queryClient = createQueryClient();
