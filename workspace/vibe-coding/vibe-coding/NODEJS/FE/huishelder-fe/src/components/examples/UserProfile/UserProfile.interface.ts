export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

/**
 * Props for the UserProfile presenter component
 */
export interface UserProfileProps {
  /**
   * User data to display
   */
  user: User | null;

  /**
   * Loading state indicator
   */
  isLoading: boolean;

  /**
   * Error message if any
   */
  error: string | null;

  /**
   * Callback function to update user data
   */
  onUpdate: (userData: Partial<User>) => void;

  /**
   * Loading state for update operation
   */
  isUpdating: boolean;
}
