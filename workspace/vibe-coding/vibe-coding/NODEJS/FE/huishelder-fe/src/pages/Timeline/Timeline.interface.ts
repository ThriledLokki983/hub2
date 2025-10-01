export interface TimelineStep {
  id: string;
  step_id?: string; // For backward compatibility
  name?: string; // For backward compatibility
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string;
  completed_at?: string;
  description?: string;
}

export interface TimelineProps {
  steps: TimelineStep[];
  isLoading: boolean;
  error?: string | null;
  onStepComplete: (stepId: string) => void;
}

export interface EnhancedTimelineProps {
  data?: {
    steps: TimelineStep[];
    completion_percentage: number;
    category_breakdown: {
      buying: number;
      selling: number;
      shared: number;
    };
  };
  steps: TimelineStep[];
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
