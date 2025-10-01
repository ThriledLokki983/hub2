import { UserInterface } from 'hooks/interfaces/user.interface';

/**
 * Props for the Profile presenter component
 */
export interface ProfileProps {
  /**
   * Current user data
   */
  user: UserInterface | null;

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
  onUpdateProfile: (userData: Partial<UserInterface['profile']>) => void;

  /**
   * Whether a profile update is in progress
   */
  isUpdating: boolean;
}
