import { Milestone } from '../../hooks/interfaces/journey';

export interface TimelineProps {
  milestones: Milestone[];
  currentMilestoneId?: string;
  showDetails?: boolean;
  maxVisible?: number;
}
