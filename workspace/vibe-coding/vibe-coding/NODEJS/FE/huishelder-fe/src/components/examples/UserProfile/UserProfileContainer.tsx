import React from 'react';
import UserProfile from './UserProfile';
import { useUserProfile } from 'hooks/useUserProfile';
import { User } from './UserProfile.interface';

/**
 * UserProfileContainer - Container component that handles data fetching and business logic
 *
 * This component uses a feature-specific hook that encapsulates all profile-related API operations
 * It demonstrates best practices for separating business logic from presentation
 */
const UserProfileContainer: React.FC = () => {
  // Use our domain-specific hook instead of direct API calls
  const { user, isLoading, error, updateProfile, isUpdating } = useUserProfile();

  // Format any error message for the UI
  const errorMessage = error
    ? error instanceof Error
      ? error.message
      : 'Failed to load user profile'
    : null;

  // Handle user profile updates
  const handleUpdateUser = (userData: Partial<User>) => {
    updateProfile(userData);
  };

  // Pass all required data and handlers to the presenter component
  return (
    <UserProfile
      user={user || null}
      isLoading={isLoading}
      error={errorMessage}
      onUpdate={handleUpdateUser}
      isUpdating={isUpdating}
    />
  );
};

export default UserProfileContainer;
