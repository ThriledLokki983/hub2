export type MilestoneStatus = 'not_started' | 'in_progress' | 'completed';
export type TaskStatus = 'pending' | 'in_progress' | 'done';
export type DocumentStatus = 'required' | 'optional' | 'uploaded' | 'verified';
export type CategoryType = 'buying' | 'selling' | 'shared';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate?: string; // ISO date string
  status: MilestoneStatus;
  order: number;
  tasks: Task[];
  isCurrentMilestone: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  milestoneId: string;
  milestoneName?: string; // Name of the milestone this task belongs to
  dueDate?: string; // ISO date string
  relatedDocuments?: Document[];
}

export interface Document {
  id: string;
  name: string;
  type: string;
  status: DocumentStatus;
  uploadDate?: string; // ISO date string
  fileUrl?: string;
  taskId?: string;
  milestoneId?: string;
}

export interface FinancialSummary {
  estimatedMortgage: number; // in euros
  bridgeLoan?: number; // in euros (optional, only if user is selling current home)
  boeterente?: number; // in euros (penalty interest, optional)
  monthlyGrossCost: number; // in euros
  monthlyNetCost: number; // in euros
  additionalCosts: Record<string, number>; // e.g. insurance, maintenance, etc.
  currency: string; // e.g. "EUR"
}

export interface JourneyResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isFirstTimeHomebuyer: boolean;
    isSellingCurrentHome: boolean;
  };
  timeline: Milestone[];
  currentMilestone: Milestone;
  upcomingTasks: Task[];
  financialSummary: FinancialSummary;
  requiredDocuments: Document[];
}

export interface TaskCompletionResponse {
  taskId: string;
  success: boolean;
  newStatus: TaskStatus;
  updatedMilestones?: Milestone[];
}

export interface DocumentUploadResponse {
  documentId: string;
  name: string;
  status: DocumentStatus;
  fileUrl: string;
  taskId?: string;
  milestoneId?: string;
}

// Backend API response interfaces
export interface ApiMilestone {
  id: string;
  code: string;
  name: string;
  description: string;
  order_index: number;
  is_optional: boolean;
}

export interface ApiTask {
  id: string;
  title: string;
  status: string; // "PENDING", "IN_PROGRESS", "COMPLETE"
  related_document_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiTimelineItem {
  id: string;
  user_journey_id: string;
  milestone_id: string;
  is_complete: boolean;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  milestone: ApiMilestone;
  tasks: ApiTask[];
}

// Type for array of timeline items from backend
export type ApiTimelineResponse = ApiTimelineItem[];

// API response interfaces
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
}

// API types for financial summary
export interface ApiFinancialData {
  estimated_mortgage: number;
  monthly_gross: number;
  monthly_net: number;
  bridge_loan_needed?: number;
  estimated_boeterente?: number;
  additional_costs?: Record<string, number>;
}

export type ApiFinancialSummaryResponse = ApiResponse<ApiFinancialData>;

// Type for task completion response
export interface ApiTaskResponse {
  success: boolean;
  message: string;
  data: {
    taskId: string;
    status: string;
  };
}

// Enhanced Timeline Interfaces
export interface EnhancedTimelineStep {
  id: string;
  title: string;
  description: string;
  status: string;
  due_date?: string;
  category?: CategoryType;
  priority?: number;
  dependencies?: string[];
  notifications?: boolean;
  notes?: string;
  completed_at?: string;
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

export interface EnhancedTimelineResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: EnhancedTimelineData;
}
