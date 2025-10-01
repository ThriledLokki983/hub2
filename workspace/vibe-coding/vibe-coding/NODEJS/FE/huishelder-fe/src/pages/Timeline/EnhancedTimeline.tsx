import React from 'react';
import { TimelineStepCard, TimelineFilterBar, TimelineProgressBar } from 'components/Journey';
import {
  EnhancedTimelineData,
  EnhancedTimelineStep,
} from 'components/Journey/TimelineEnhanced/shared';
import styles from './EnhancedTimeline.module.scss';

interface EnhancedTimelineProps {
  data?: EnhancedTimelineData;
  steps: EnhancedTimelineStep[];
  isLoading: boolean;
  error?: string | null;
  filters: {
    status: string;
    category: string;
    sortBy: string;
  };
  expandedSteps: Record<string, boolean>;
  onFilterChange: (key: string, value: string) => void;
  onStatusChange: (stepId: string, status: string) => void;
  onNotesChange: (stepId: string, notes: string) => void;
  onToggleExpand: (stepId: string) => void;
}

const EnhancedTimeline: React.FC<EnhancedTimelineProps> = ({
  data,
  steps,
  isLoading,
  error,
  filters,
  expandedSteps,
  onFilterChange,
  onStatusChange,
  onNotesChange,
  onToggleExpand,
}) => {
  if (isLoading) {
    return <div className={styles.loading}>Loading timeline...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error loading timeline: {error}</div>;
  }

  if (!data || steps.length === 0) {
    return <div className={styles.empty}>No timeline steps available.</div>;
  }

  const { completion_percentage, category_breakdown } = data;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Your Home Journey</h1>
        <p className={styles.subtitle}>
          Track your progress through each step of your home buying or selling journey
        </p>
      </div>

      <TimelineProgressBar
        percentage={completion_percentage}
        categoryBreakdown={category_breakdown}
      />

      <TimelineFilterBar filters={filters} onFilterChange={onFilterChange} />

      <div className={styles.steps}>
        {steps.map(step => (
          <TimelineStepCard
            key={step.id}
            step={step}
            isExpanded={!!expandedSteps[step.id]}
            onStatusChange={onStatusChange}
            onNotesChange={onNotesChange}
            onToggleExpand={onToggleExpand}
          />
        ))}
      </div>

      {steps.length === 0 && (
        <div className={styles.noResults}>No steps match your current filter settings.</div>
      )}
    </div>
  );
};

export default EnhancedTimeline;
