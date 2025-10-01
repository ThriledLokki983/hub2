import React, { useState } from 'react';
import { useUserContext } from 'contexts';
import { ApiResponse, useMutationApi } from 'hooks/useQueryApi';
import {
  UPDATE_USER_SETTINGS,
  UPDATE_USER_PASSWORD,
  UPLOAD_USER_PHOTO,
  UPDATE_USER_PHOTO,
  DELETE_USER_PHOTO,
} from 'configs/api-endpoints';
import { SettingsData } from './Settings.interface';
import Settings from './Settings';

/**
 * Settings page container component - handles data fetching and business logic
 * This follows the container part of the Container/Presenter pattern
 * @returns React component
 */
const SettingsContainer: React.FC = () => {
  const { user } = useUserContext();
  const [isPhotoUploading, setIsPhotoUploading] = useState<boolean>(false);

  // Use mutation API for settings updates
  const {
    mutate: updateSettings,
    isPending: isUpdating,
    error,
  } = useMutationApi(UPDATE_USER_SETTINGS, {
    onSuccess: (_response: ApiResponse) => {},
    onError: (_error: Error) => {},
  });

  // Use mutation API for photo uploads
  const { mutate: handlePhotoUpload, isPending: isUploading } = useMutationApi(UPLOAD_USER_PHOTO, {
    onSuccess: (_response: ApiResponse) => {
      setIsPhotoUploading(false);
    },
    onError: (_error: Error) => {
      setIsPhotoUploading(false);
    },
  });

  // Use mutation API for photo deletion
  const { mutate: handlePhotoDelete } = useMutationApi(DELETE_USER_PHOTO, {
    onSuccess: (_response: ApiResponse) => {},
    onError: (_error: Error) => {},
  });

  // Format any error message for the UI
  const errorMessage = error
    ? error instanceof Error
      ? error.message
      : 'Failed to update settings. Please try again.'
    : null;

  // Handle settings updates
  const handleUpdateSettings = (settingsData: SettingsData) => {
    if (settingsData.account?.password) {
      updateSettings({
        endpoint: UPDATE_USER_PASSWORD,
        data: settingsData.account.password,
      });
    } else {
      updateSettings({
        data: settingsData,
      });
    }
  };

  // Handle profile photo upload
  const uploadPhoto = (file: File) => {
    if (!user?.id) return;
    setIsPhotoUploading(true);

    const formData = new FormData();
    formData.append('photo', file);

    // Determine if we need to create or update the photo
    const hasExistingPhoto = !!user.photoUrl;
    const endpoint = hasExistingPhoto
      ? { ...UPDATE_USER_PHOTO, endpoint: UPDATE_USER_PHOTO.endpoint.replace(':id', user.id) }
      : { ...UPLOAD_USER_PHOTO, endpoint: UPLOAD_USER_PHOTO.endpoint.replace(':id', user.id) };

    handlePhotoUpload({
      endpoint,
      data: formData,
    });
  };

  // Handle profile photo deletion
  const deletePhoto = () => {
    if (!user?.id) return;

    handlePhotoDelete({
      endpoint: {
        ...DELETE_USER_PHOTO,
        endpoint: DELETE_USER_PHOTO.endpoint.replace(':id', user.id),
      },
    });
  };

  return (
    <Settings
      user={user}
      isLoading={false}
      error={errorMessage}
      onUpdateSettings={handleUpdateSettings}
      isUpdating={isUpdating}
      onUploadPhoto={uploadPhoto}
      onDeletePhoto={deletePhoto}
      isPhotoUploading={isPhotoUploading || isUploading}
    />
  );
};

export default SettingsContainer;
