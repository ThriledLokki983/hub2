import React, { useState } from 'react';
import { Icon, LabeledInput, CustomSelect } from 'components';
import { ProfileProps } from './Profile.interface';
import styles from './Profile.module.scss';

/**
 * Format a date string into a human-readable format
 * Handles invalid dates gracefully
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Profile presenter component - handles UI rendering for the user profile page
 *
 * @param props - Component properties
 * @returns React component
 */
const Profile: React.FC<ProfileProps> = ({
  user,
  isLoading,
  error,
  onUpdateProfile,
  isUpdating,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    language_preference: '',
    role: '',
  });

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'nl', label: 'Dutch' },
    { value: 'de', label: 'German' },
    { value: 'fr', label: 'French' },
  ];

  const roleOptions = [
    { value: 'buyer', label: 'Buyer' },
    { value: 'seller', label: 'Seller' },
    { value: 'agent', label: 'Agent' },
  ];

  // Start editing profile data
  const handleEditClick = () => {
    if (user && user.profile) {
      setFormData({
        first_name: user.profile.first_name || '',
        last_name: user.profile.last_name || '',
        name: user.profile.name || '',
        email: user.profile.email || '',
        phone: user.profile.phone || '',
        address: user.profile.address || '',
        language_preference: user.profile.language_preference || 'en',
        role: user.profile.role || '',
      });
      setIsEditing(true);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit updated profile data
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
  };

  // Generate user initials for avatar
  const getInitials = () => {
    if (!user?.profile) return '';

    const { first_name, last_name } = user.profile;
    if (first_name && last_name) {
      return `${first_name[0]}${last_name[0]}`.toUpperCase();
    }
    return user.profile.name.substring(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.section}>
          <div className={styles.loading}>
            <Icon
              name="circle-notch"
              phosphor="CircleNotch"
              weight="light"
              width={24}
              className={styles.spinnerIcon}
            />
            Loading profile...
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.section}>
          <div className={styles.errorMessage}>Please log in to view your profile.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Profile</h1>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.section}>
        <h2>Personal Information</h2>

        <div className={styles.profileGrid}>
          <div className={styles.profilePhoto}>
            <div className={styles.photoContainer}>
              {user.profile.avatar_url ? (
                <img src={user.profile.avatar_url} alt={user.profile.name} />
              ) : (
                getInitials()
              )}
            </div>

            <button type="button" className={styles.uploadButton}>
              <Icon name="camera" phosphor="Camera" weight="light" width={16} />
              Update Photo
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className={styles.profileForm}>
              <div className={styles.fieldRow} data-names>
                <LabeledInput id="firstName" label="First Name">
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </LabeledInput>

                <LabeledInput id="lastName" label="Last Name">
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </LabeledInput>
              </div>

              <LabeledInput id="email" label="Email Address">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </LabeledInput>

              <LabeledInput id="phone" label="Phone Number">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+31 "
                />
              </LabeledInput>

              <LabeledInput id="address" label="Address">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </LabeledInput>

              <LabeledInput id="language" label="Preferred Language">
                <CustomSelect
                  name="language_preference"
                  value={formData.language_preference}
                  onChange={value =>
                    handleInputChange({
                      target: { name: 'language_preference', value },
                    } as React.ChangeEvent<HTMLSelectElement>)
                  }
                  options={languageOptions}
                  placeholder="Select language"
                />
              </LabeledInput>

              <LabeledInput id="role" label="Role">
                <CustomSelect
                  name="role"
                  value={formData.role}
                  onChange={value =>
                    handleInputChange({
                      target: { name: 'role', value },
                    } as React.ChangeEvent<HTMLSelectElement>)
                  }
                  options={roleOptions}
                  placeholder="Select role"
                />
              </LabeledInput>

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelButton} onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className={styles.saveButton} disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Icon
                        name="circle-notch"
                        phosphor="CircleNotch"
                        weight="light"
                        width={16}
                        className={styles.spinnerIcon}
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Icon name="floppy-disk" phosphor="FloppyDisk" weight="light" width={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.profileForm}>
              <div className={styles.fieldRow} data-names>
                <LabeledInput
                  id="profile-first-name-readonly"
                  label="First Name"
                  icon={{
                    object: () => (
                      <Icon name="user" phosphor="User" weight="light" width={20} color="#3A4F41" />
                    ),
                  }}
                >
                  <input
                    type="text"
                    value={user.profile.first_name}
                    disabled
                    className={styles.inputReadOnly}
                  />
                </LabeledInput>

                <LabeledInput
                  id="profile-last-name-readonly"
                  label="Last Name"
                  icon={{
                    object: () => (
                      <Icon name="user" phosphor="User" weight="light" width={20} color="#3A4F41" />
                    ),
                  }}
                >
                  <input
                    type="text"
                    value={user.profile.last_name}
                    disabled
                    className={styles.inputReadOnly}
                  />
                </LabeledInput>
              </div>

              <LabeledInput
                id="profile-name-readonly"
                label="Username"
                icon={{
                  object: () => (
                    <Icon name="user" phosphor="User" weight="light" width={20} color="#3A4F41" />
                  ),
                }}
              >
                <input
                  type="text"
                  value={user.profile.name}
                  disabled
                  className={styles.inputReadOnly}
                />
              </LabeledInput>

              <LabeledInput
                id="profile-email-readonly"
                label="Email Address"
                icon={{
                  object: () => (
                    <Icon
                      name="envelope"
                      phosphor="Envelope"
                      weight="light"
                      width={20}
                      color="#3A4F41"
                    />
                  ),
                }}
              >
                <input
                  type="email"
                  value={user.profile.email}
                  disabled
                  className={styles.inputReadOnly}
                />
              </LabeledInput>

              <LabeledInput
                id="profile-phone-readonly"
                label="Phone Number"
                icon={{
                  object: () => (
                    <Icon name="phone" phosphor="Phone" weight="light" width={20} color="#3A4F41" />
                  ),
                }}
              >
                <input
                  type="tel"
                  value={user.profile.phone || '-'}
                  disabled
                  className={styles.inputReadOnly}
                />
              </LabeledInput>

              <LabeledInput
                id="profile-address-readonly"
                label="Address"
                icon={{
                  object: () => (
                    <Icon
                      name="map-pin"
                      phosphor="MapPin"
                      weight="light"
                      width={20}
                      color="#3A4F41"
                    />
                  ),
                }}
              >
                <input
                  type="text"
                  value={user.profile.address || '-'}
                  disabled
                  className={styles.inputReadOnly}
                />
              </LabeledInput>

              <div className={styles.fieldRow} data-names>
                <LabeledInput
                  id="profile-language-readonly"
                  label="Language Preference"
                  icon={{
                    object: () => (
                      <Icon
                        name="translate"
                        phosphor="Translate"
                        weight="light"
                        width={20}
                        color="#3A4F41"
                      />
                    ),
                  }}
                >
                  <input
                    type="text"
                    value={
                      user.profile.language_preference === 'en'
                        ? 'English'
                        : user.profile.language_preference === 'nl'
                          ? 'Dutch'
                          : user.profile.language_preference === 'fr'
                            ? 'French'
                            : user.profile.language_preference === 'de'
                              ? 'German'
                              : user.profile.language_preference
                    }
                    disabled
                    className={styles.inputReadOnly}
                  />
                </LabeledInput>

                <LabeledInput
                  id="profile-role-readonly"
                  label="Role"
                  icon={{
                    object: () => (
                      <Icon
                        name="user-circle"
                        phosphor="UserCircle"
                        weight="light"
                        width={20}
                        color="#3A4F41"
                      />
                    ),
                  }}
                >
                  <input
                    type="text"
                    value={
                      user.profile.role?.slice(0, 1).toUpperCase() + user.profile.role.slice(1)
                    }
                    disabled
                    className={styles.inputReadOnly}
                  />
                </LabeledInput>
              </div>

              <div className={styles.accountInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Account Created:</span>
                  <span className={styles.infoValue}>{formatDate(user.profile.created_at)}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Last Updated:</span>
                  <span className={styles.infoValue}>{formatDate(user.profile.updated_at)}</span>
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.saveButton} onClick={handleEditClick}>
                  <Icon name="pencil" phosphor="PencilSimple" weight="light" width={16} />
                  Edit Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
