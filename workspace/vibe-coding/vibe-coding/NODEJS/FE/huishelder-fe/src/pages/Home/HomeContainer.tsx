import React from 'react';
import { useUserDashboard } from 'hooks/useUserDashboard';
import { useUserProfile } from 'hooks/useUserProfile';
import { useJourney } from 'hooks/useJourney';
import { User } from 'components/examples/UserProfile';
import Home from './Home';

/**
 * Home page container component - handles business logic and data fetching
 * This follows the container part of the Container/Presenter pattern
 *
 * @returns React component
 */
const HomeContainer: React.FC = () => {
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

  // Pass all required data and handlers to the presenter component
  return (
    <Home
      user={dashboardUser || null}
      isLoading={isLoading}
      error={errorMessage}
      onUpdateProfile={handleUpdateProfile}
      isUpdating={isUpdating}
      onRefresh={handleRefreshAll}
      journey={journey}
      currentMilestone={currentMilestone}
      upcomingTasks={upcomingTasks}
      financialSummary={financialSummary}
      hasJourneyErrors={hasJourneyErrors}
    />
  );
};

export default HomeContainer;
