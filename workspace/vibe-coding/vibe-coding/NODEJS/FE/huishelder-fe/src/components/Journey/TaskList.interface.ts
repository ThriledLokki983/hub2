import { Task, Document } from '../../hooks/interfaces/journey';

export interface TaskListProps {
  tasks: Task[];
  onTaskComplete?: (taskId: string) => Promise<void>;
  showMilestoneInfo?: boolean;
  title?: string;
  requiredDocuments?: Document[];
  onUpload?: (file: File, taskId?: string, milestoneId?: string) => Promise<unknown>;
  uploadProgress?: number;
}
