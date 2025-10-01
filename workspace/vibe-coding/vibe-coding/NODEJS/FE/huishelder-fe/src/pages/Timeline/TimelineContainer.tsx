import React, { useMemo } from 'react';
import useJourney from 'hooks/useJourney';
import { Milestone } from 'hooks/interfaces/journey';
import { TimelineStep } from './Timeline.interface';
import Timeline from './Timeline';

/**
 * Container component for Timeline that connects to the Journey data
 */
const TimelineContainer: React.FC = () => {
  const { timeline, isLoading, hasErrors, errors, markTaskComplete } = useJourney();

  // Convert milestone data to TimelineStep format expected by Timeline component
  const timelineSteps: TimelineStep[] = useMemo(() => {
    if (!timeline || !timeline.length) return [];

    return timeline.map((milestone: Milestone) => ({
      id: milestone.id,
      step_id: milestone.id,
      name: milestone.title,
      title: milestone.title,
      // Map journey milestone status to timeline status format
      status:
        milestone.status === 'not_started'
          ? 'pending'
          : (milestone.status as 'in_progress' | 'completed'),
      due_date: milestone.dueDate || new Date().toISOString(),
      description: milestone.description,
    }));
  }, [timeline]);

  // Format any error messages
  const errorMessage = hasErrors ? String(errors) : null;

  // Handle completion of a step
  const handleStepComplete = (stepId: string) => {
    markTaskComplete(stepId);
  };

  return (
    <Timeline
      steps={timelineSteps}
      isLoading={isLoading}
      error={errorMessage}
      onStepComplete={handleStepComplete}
    />
  );
};

export default TimelineContainer;
