import { TimelineStep } from '../../../pages/Timeline/Timeline.interface';

export interface EnhancedTimelineStep extends TimelineStep {
  category?: 'buying' | 'selling' | 'shared';
  priority?: number;
  dependencies?: string[];
  notifications?: boolean;
  notes?: string;
}

export interface EnhancedTimelineData {
  steps: EnhancedTimelineStep[];
  completion_percentage: number;
  category_breakdown: {
    buying: number;
    selling: number;
    shared: number;
  };
}

export interface TimelineStepCardProps {
  step: EnhancedTimelineStep;
  onStatusChange?: (stepId: string, status: string) => void;
  onNotesChange?: (stepId: string, notes: string) => void;
  isExpanded?: boolean;
  onToggleExpand?: (stepId: string) => void;
}

export interface TimelineFilterBarProps {
  filters: {
    status: string;
    category: string;
    sortBy: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

export interface TimelineProgressBarProps {
  percentage: number;
  categoryBreakdown: {
    buying: number;
    selling: number;
    shared: number;
  };
}
