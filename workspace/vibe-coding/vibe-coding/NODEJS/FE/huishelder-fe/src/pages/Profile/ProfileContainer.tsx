import React from 'react';
import { useUserContext } from 'contexts';
import { useMutationApi } from 'hooks/useQueryApi';
import { UPDATE_USER_PROFILE } from 'configs/api-endpoints';
import { UserProfile } from 'hooks/interfaces/user.interface';
import Profile from './Profile';

/**
 * Profile page container component - handles data fetching and business logic
 * This follows the container part of the Container/Presenter pattern
 *
 * @returns React component
 */
const ProfileContainer: React.FC = () => {
  const { user } = useUserContext();

  // Use mutation API for profile updates
  const {
    mutate: updateProfile,
    isPending: isUpdating,
    error,
  } = useMutationApi(UPDATE_USER_PROFILE, {
    onSuccess: (response: any) => {
      console.log('Profile updated successfully:', response);
      // Here you would typically update the user context with the new data
    },
    onError: (error: any) => {
      console.error('Failed to update profile:', error);
    },
  });

  // Format any error message for the UI
  const errorMessage = error
    ? error instanceof Error
      ? error.message
      : 'Failed to update profile. Please try again.'
    : null;

  // Handle profile updates - only send fields that can be updated
  const handleUpdateProfile = (profileData: Partial<UserProfile>) => {
    // Extract only the fields that we want to update
    const updateData = {
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      address: profileData.address,
      language_preference: profileData.language_preference,
    };

    updateProfile(updateData);
  };

  return (
    <Profile
      user={user}
      isLoading={false}
      error={errorMessage}
      onUpdateProfile={handleUpdateProfile}
      isUpdating={isUpdating}
    />
  );
};

export default ProfileContainer;
