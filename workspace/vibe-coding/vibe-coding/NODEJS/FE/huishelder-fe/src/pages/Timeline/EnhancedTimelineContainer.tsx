import React, { useState, useMemo } from 'react';
import useJourney from 'hooks/useJourney';
import {
  EnhancedTimelineStep,
  EnhancedTimelineData,
} from 'components/Journey/TimelineEnhanced/shared';
import EnhancedTimeline from './EnhancedTimeline';

const EnhancedTimelineContainer: React.FC = () => {
  // Set up filters state
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    sortBy: 'due_date',
  });

  // Track expanded step cards
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});

  // Use our enhanced timeline data from useJourney hook
  const { enhancedTimeline } = useJourney();

  const {
    data: apiResponse,
    isLoading,
    error: fetchError,
    updateStep,
    isUpdating,
    updateError,
  } = enhancedTimeline;

  // Extract the timeline data from the API response
  const data = apiResponse?.data as unknown as EnhancedTimelineData;

  // Filter and sort steps based on current filters using useMemo for performance
  const filteredSteps = useMemo(() => {
    if (!data?.steps) return [];

    return data.steps
      .filter((step: EnhancedTimelineStep) => {
        // Filter by status if not set to 'all'
        if (filters.status !== 'all' && step.status !== filters.status) {
          return false;
        }

        // Filter by category if not set to 'all'
        if (filters.category !== 'all' && step.category !== filters.category) {
          return false;
        }

        return true;
      })
      .sort((a: EnhancedTimelineStep, b: EnhancedTimelineStep) => {
        // Sort logic based on the selected sort option
        switch (filters.sortBy) {
          case 'due_date': {
            // Sort by due date, then by priority
            if (a.due_date && b.due_date) {
              const dateComparison =
                new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
              if (dateComparison !== 0) return dateComparison;
            } else if (a.due_date) {
              return -1; // a has a date, b doesn't
            } else if (b.due_date) {
              return 1; // b has a date, a doesn't
            }
            // If dates are equal or both undefined, fall back to priority
            return (b.priority || 0) - (a.priority || 0);
          }

          case 'status': {
            // Custom status ordering: in_progress, pending, completed
            const statusOrder = { in_progress: 0, pending: 1, completed: 2 };
            return (
              statusOrder[a.status as keyof typeof statusOrder] -
              statusOrder[b.status as keyof typeof statusOrder]
            );
          }

          case 'priority': {
            // Sort by priority (higher first), then by due date
            const priorityDiff = (b.priority || 0) - (a.priority || 0);
            if (priorityDiff !== 0) return priorityDiff;
            // If priorities are equal, sort by due date
            if (a.due_date && b.due_date) {
              return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
            }
            return 0;
          }

          default:
            return 0;
        }
      });
  }, [data?.steps, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleStatusChange = (stepId: string, status: string) => {
    updateStep({
      step_id: stepId,
      status,
      updated_at: new Date().toISOString(),
    });
  };

  const handleNotesChange = (stepId: string, notes: string) => {
    updateStep({
      step_id: stepId,
      notes,
      updated_at: new Date().toISOString(),
    });
  };

  const toggleStepExpand = (stepId: string) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  // Combine any errors
  const error = fetchError || updateError;
  const errorMessage = error ? String(error) : null;

  return (
    <EnhancedTimeline
      data={data}
      steps={filteredSteps}
      isLoading={isLoading || isUpdating}
      error={errorMessage}
      filters={filters}
      expandedSteps={expandedSteps}
      onFilterChange={handleFilterChange}
      onStatusChange={handleStatusChange}
      onNotesChange={handleNotesChange}
      onToggleExpand={toggleStepExpand}
    />
  );
};

export default EnhancedTimelineContainer;
