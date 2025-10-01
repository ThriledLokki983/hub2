import { useQueryApi, useMutationApi } from './useQueryApi';
import { User } from 'components/examples/UserProfile';
import { useQueryClient } from '@tanstack/react-query';

// Define query keys for proper cache management
export const userProfileKeys = {
  all: ['user'] as const,
  profile: () => [...userProfileKeys.all, 'profile'] as const,
  settings: () => [...userProfileKeys.all, 'settings'] as const,
};

/**
 * Hook for managing user profile operations
 *
 * This is a feature-specific hook that centralizes all user profile API operations
 * and provides a clean interface for components to interact with user data
 */
export function useUserProfile() {
  const queryClient = useQueryClient();

  // Fetch user profile data
  const profileQuery = useQueryApi<User>(
    {
      endpoint: '/users/me',
      method: 'GET',
      json: true,
    },
    null,
    {
      // Use appropriate query key for cache management
      queryKey: userProfileKeys.profile(),
      // Don't refetch on window focus for this example
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  );

  // Setup mutation for updating user profile
  const updateProfileMutation = useMutationApi<User>(
    {
      endpoint: '/api/user/me',
      method: 'PATCH',
      json: true,
    },
    {
      // Optimistic update - immediately update UI before server response
      onMutate: async newData => {
        // Cancel any outgoing refetches to avoid overwriting optimistic update
        await queryClient.cancelQueries({ queryKey: userProfileKeys.profile() });

        // Snapshot the previous value
        const previousProfile = queryClient.getQueryData(userProfileKeys.profile());

        // Optimistically update to the new value
        queryClient.setQueryData(userProfileKeys.profile(), (old: any) => ({
          ...old,
          data: {
            ...old?.data,
            ...newData,
          },
        }));

        // Return a context object with the snapshot
        return { previousProfile };
      },

      // If mutation fails, use context to roll back
      onError: (_error, _variables, context) => {
        if (context?.previousProfile) {
          queryClient.setQueryData(userProfileKeys.profile(), context.previousProfile);
        }
      },

      // Always refetch after error or success to ensure fresh data
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: userProfileKeys.profile() });
      },
    },
  );

  return {
    // User data and query state
    user: profileQuery.data?.data,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,

    // Mutation functions and state
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,

    // Full access to the query results
    profileQuery,
    updateProfileMutation,
  };
}

export default useUserProfile;
