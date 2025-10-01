import { UserInterface } from 'hooks/interfaces/user.interface';

/**
 * Props for the Settings presenter component
 */
export interface SettingsProps {
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
   * Function to handle settings updates
   */
  onUpdateSettings: (data: SettingsData) => void;

  /**
   * Whether a settings update is in progress
   */
  isUpdating: boolean;

  /**
   * Function to handle profile photo upload
   */
  onUploadPhoto?: (file: File) => void;

  /**
   * Function to handle profile photo deletion
   */
  onDeletePhoto?: () => void;

  /**
   * Whether a photo upload is in progress
   */
  isPhotoUploading?: boolean;
}

/**
 * Settings data structure
 */
export interface SettingsData {
  notifications?: {
    emailAlerts: boolean;
    smsAlerts: boolean;
    marketingEmails: boolean;
  };
  privacy?: {
    showProfile: boolean;
    showContactInfo: boolean;
  };
  account?: {
    password?: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    };
    photo?: File; // For profile photo upload
  };
}
