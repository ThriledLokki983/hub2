export interface JourneyInitDto {
  is_first_time_buyer: boolean;
  is_selling_current_home: boolean;
  has_bridge_loan: boolean;
}

export interface UserJourney {
  id: string;
  user_id: string;
  is_first_time_buyer: boolean;
  is_selling_current_home: boolean;
  has_bridge_loan: boolean;
  current_stage: string;
  journey_started_at: Date;
  updated_at: Date;
}

export interface Milestone {
  id: string;
  code: string;
  name: string;
  description: string | null;
  order_index: number;
  is_optional: boolean;
}

export interface UserMilestone {
  id: string;
  user_journey_id: string;
  milestone_id: string;
  is_complete: boolean;
  due_date: Date | null;
  completed_at: Date | null;
  created_at: Date;
  milestone?: Milestone;
  tasks?: UserTask[];
}

export interface UserTask {
  id: string;
  user_milestone_id: string;
  title: string;
  status: TaskStatus;
  related_document_id: string | null;
  created_at: Date;
  updated_at: Date;
  document?: Document;
}

export interface Document {
  id: string;
  user_id: string;
  type: string;
  filename: string;
  file_url: string;
  uploaded_at: Date;
}

export interface FinancialSummary {
  id: string;
  user_journey_id: string;
  estimated_mortgage: number | null;
  estimated_boeterente: number | null;
  bridge_loan_needed: number | null;
  monthly_gross: number | null;
  monthly_net: number | null;
  updated_at: Date;
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export interface TimelineResponse {
  milestones: UserMilestone[];
}

export interface TasksResponse {
  tasks: UserTask[];
}

export interface FinancialSummaryDto {
  estimated_mortgage?: number;
  estimated_boeterente?: number;
  bridge_loan_needed?: number;
  monthly_gross?: number;
  monthly_net?: number;
}

export interface TimelineStep {
  id: string;
  name: string;
  description: string | null;
  order: number;
  default_due_in_days: number | null;
  category: TimelineStepCategory;
  priority: number;
  dependencies: string[];
  related_tool_ids: string[];
  created_at: Date;
  updated_at: Date;
}

export interface UserTimelineStep {
  id: string;
  user_id: string;
  timeline_step_id: string;
  status: TimelineStepStatus;
  due_date: Date | null;
  completed_at: Date | null;
  notes: string | null;
  priority: number;
  notification_enabled: boolean;
  created_at: Date;
  updated_at: Date;
  timeline_step?: TimelineStep;
}

export interface EnhancedTimelineResponse {
  steps: UserTimelineStep[];
  progress: {
    total: number;
    completed: number;
    in_progress: number;
    pending: number;
    percentage: number;
  };
}

export interface TimelineStepUpdateDto {
  status?: TimelineStepStatus;
  due_date?: Date;
  priority?: number;
  notification_enabled?: boolean;
  notes?: string;
}

export enum TimelineStepCategory {
  BUYING = 'buying',
  SELLING = 'selling',
  SHARED = 'shared',
}

export enum TimelineStepStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}
