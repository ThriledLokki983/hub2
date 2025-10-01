import { User } from 'components/examples/UserProfile';
import { JourneyResponse, Milestone, Task, FinancialSummary } from '../../hooks/interfaces/journey';

/**
 * Props interface for the Home page presenter component
 */
export interface HomeProps {
  /**
   * Current user data to display on the dashboard
   */
  user: User | null;

  /**
   * Whether user data is currently loading
   */
  isLoading: boolean;

  /**
   * Any error message to display
   */
  error: string | null;

  /**
   * Function to handle user profile updates
   */
  onUpdateProfile: (userData: Partial<User>) => void;

  /**
   * Whether a profile update is in progress
   */
  isUpdating: boolean;

  /**
   * Function to refresh the dashboard data
   */
  onRefresh: () => void;

  /**
   * The full journey data from the API
   */
  journey?: JourneyResponse;

  /**
   * The current milestone in the user's journey
   */
  currentMilestone?: Milestone;

  /**
   * List of upcoming tasks for the user
   */
  upcomingTasks?: Task[];

  /**
   * Financial summary information
   */
  financialSummary?: FinancialSummary;

  /**
   * Whether there are errors in fetching journey data
   */
  hasJourneyErrors?: boolean;
}
