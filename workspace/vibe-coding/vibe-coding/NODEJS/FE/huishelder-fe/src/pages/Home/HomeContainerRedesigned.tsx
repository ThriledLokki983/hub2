import React from 'react';
import { useJourney } from 'hooks/useJourney';
import HomeRedesigned from './HomeRedesigned';

/**
 * Home page container component
 * Uses the container/presenter pattern to separate business logic from presentation
 */
const HomeContainer: React.FC = () => {
  const { isLoading, error, refetch, data: journeyData } = useJourney();

  // If we have errors or are still loading, we can handle those states here
  if (isLoading) {
    return <div>Loading your home journey...</div>;
  }

  if (error) {
    return (
      <div>
        <h2>Something went wrong</h2>
        <p>We couldn't load your home journey information. Please try again later.</p>
        <button onClick={() => refetch()}>Try Again</button>
      </div>
    );
  }

  // Extract the data we need for the presenter component
  const { user, currentMilestone, upcomingTasks, financialSummary, hasErrors } = journeyData || {
    user: null,
    currentMilestone: null,
    upcomingTasks: [],
    financialSummary: null,
    hasErrors: false,
  };

  return (
    <HomeRedesigned
      user={user}
      isLoading={isLoading}
      error={error}
      onUpdateProfile={() => {}}
      isUpdating={false}
      onRefresh={() => refetch()}
      journey={{}}
      currentMilestone={currentMilestone}
      upcomingTasks={upcomingTasks}
      financialSummary={financialSummary}
      hasJourneyErrors={hasErrors}
    />
  );
};

export default HomeContainer;
