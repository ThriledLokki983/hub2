import { useQueryApi, ApiResponse } from './useQueryApi';
import { GET_USER } from 'configs/api-endpoints';
import { UserInterface } from './interfaces';

// Types for dashboard data
interface UserActivity {
  id: string;
  type: string;
  date: string;
  description: string;
}

interface NotificationSummary {
  total: number;
  unread: number;
  notifications: Array<{
    id: string;
    message: string;
    read: boolean;
    createdAt: string;
  }>;
}

interface DashboardStatistics {
  activeProjects: number;
  completedProjects: number;
  upcomingDeadlines: number;
  teamMembers: number;
}

// Mock query structure that mirrors React Query result
interface MockQueryResult<T> {
  data?: ApiResponse<T>;
  isLoading: boolean;
  error: null | Error;
  refetch: () => Promise<{ data: T }>;
}

/**
 * Custom hook for user dashboard data
 *
 * This hook demonstrates how to combine multiple data sources while preventing duplicate calls
 * and present a unified interface for components to consume
 */
export function useUserDashboard() {
  // Instead of doing a separate call to fetch the user, we'll use the existing
  // cached data from the main user query if it exists, or trigger a fresh fetch if needed
  const profileQuery = useQueryApi<UserInterface>(GET_USER, null, {
    // By using the same query key as the main user hook, React Query will deduplicate requests
    // and use existing cached data when available
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Using mock data for these endpoints until they are ready in the backend

  // Mock data for user activity
  const mockActivities: UserActivity[] = [
    {
      id: '1',
      type: 'document_upload',
      date: new Date().toISOString(),
      description: 'Updated property documents',
    },
    {
      id: '2',
      type: 'property_view',
      date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      description: 'Viewed property details',
    },
  ];

  // Mock data for notifications
  const mockNotifications = {
    summary: {
      total: 3,
      unread: 1,
      notifications: [
        {
          id: '1',
          message: 'New property listing in your area',
          read: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          message: 'Document verification complete',
          read: true,
          createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        },
      ],
    },
  };

  // Mock data for statistics
  const mockStatistics = {
    statistics: {
      activeProjects: 2,
      completedProjects: 3,
      upcomingDeadlines: 1,
      teamMembers: 4,
    },
  };

  // Create properly typed mock queries that don't actually call the backend
  const activityQuery: MockQueryResult<{ activities: UserActivity[] }> = {
    data: {
      status: 'success',
      data: { activities: mockActivities },
      code: 200,
      message: 'OK',
    },
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve({ data: { activities: mockActivities } }),
  };

  const notificationsQuery: MockQueryResult<typeof mockNotifications> = {
    data: {
      status: 'success',
      data: mockNotifications,
      code: 200,
      message: 'OK',
    },
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve({ data: mockNotifications }),
  };

  const statisticsQuery: MockQueryResult<typeof mockStatistics> = {
    data: {
      status: 'success',
      data: mockStatistics,
      code: 200,
      message: 'OK',
    },
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve({ data: mockStatistics }),
  };

  // We only care about the real API query (profileQuery) for loading and errors
  // since the others are mocks that never actually load or have errors
  const isLoading = profileQuery.isLoading;
  const errors = profileQuery.error ? [profileQuery.error] : [];
  const hasErrors = errors.length > 0;

  // Extract data
  const user = profileQuery.data?.data; // Actual API response structure from real query

  // Extract data from mock query responses with proper typing
  const activities: UserActivity[] = activityQuery.data?.data?.activities || [];
  const notificationSummary: NotificationSummary = notificationsQuery.data?.data
    ?.summary as NotificationSummary;
  const statistics: DashboardStatistics = statisticsQuery.data?.data
    ?.statistics as DashboardStatistics;

  // Refresh function - we only need to refresh the real query
  const refreshDashboard = () => {
    // Only refresh the real API query
    profileQuery.refetch();
    // Mock queries don't need actual refreshing
  };

  return {
    // Basic status
    isLoading,
    hasErrors,
    errors,

    // Data
    user,
    activities,
    notificationSummary,
    statistics,

    // Actions
    refreshDashboard,

    // Raw query results for more control
    queries: {
      profileQuery,
      activityQuery,
      notificationsQuery,
      statisticsQuery,
    },
  };
}

export default useUserDashboard;
