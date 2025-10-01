import React, { useEffect, useState } from 'react';
import { useUserDashboard } from 'hooks/useUserDashboard';
import { useUserProfile } from 'hooks/useUserProfile';
import { useJourney } from 'hooks/useJourney';
import { User } from 'components/examples/UserProfile';
import Home from './Home';
import HomeRedesigned from './HomeRedesigned';

/**
 * Home page container component with design toggle support
 * Determines which version of the Home page to show based on user preference and env settings
 *
 * @returns React component
 */
const HomeContainer: React.FC = () => {
  // State to track design preference
  const [useRedesign, setUseRedesign] = useState<boolean>(
    import.meta.env.VITE_USE_REDESIGNED === 'true',
  );

  // Check for stored preference on mount
  useEffect(() => {
    const storedPreference = localStorage.getItem('useRedesignedUI');
    if (storedPreference !== null) {
      setUseRedesign(storedPreference === 'true');
    }
  }, []);

  // Use our domain-specific hooks to fetch data
  const {
    user: dashboardUser,
    isLoading: isDashboardLoading,
    errors: dashboardErrors,
    refreshDashboard,
  } = useUserDashboard();

  const { updateProfile, isUpdating } = useUserProfile();

  // Get journey data for the real estate home buying process
  const {
    isLoading: isJourneyLoading,
    hasErrors: hasJourneyErrors,
    journey,
    currentMilestone,
    upcomingTasks,
    financialSummary,
    refreshJourneyData,
  } = useJourney();

  // Format any error messages for the UI
  const errorMessage =
    dashboardErrors.length > 0
      ? dashboardErrors[0] instanceof Error
        ? dashboardErrors[0].message
        : 'Failed to load dashboard data'
      : null;

  // Handle user profile updates
  const handleUpdateProfile = (userData: Partial<User>) => {
    updateProfile(userData);
  };

  // Handle refresh of all data
  const handleRefreshAll = () => {
    refreshDashboard();
    refreshJourneyData();
  };

  // Combine loading states
  const isLoading = isDashboardLoading || isJourneyLoading;

  // Common props for both Home components
  const homeProps = {
    user: dashboardUser || null,
    isLoading,
    error: errorMessage,
    onUpdateProfile: handleUpdateProfile,
    isUpdating,
    onRefresh: handleRefreshAll,
    journey,
    currentMilestone,
    upcomingTasks,
    financialSummary,
    hasJourneyErrors,
  };

  // Return the appropriate version based on preference
  return useRedesign ? <HomeRedesigned {...homeProps} /> : <Home {...homeProps} />;
};

export default HomeContainer;
