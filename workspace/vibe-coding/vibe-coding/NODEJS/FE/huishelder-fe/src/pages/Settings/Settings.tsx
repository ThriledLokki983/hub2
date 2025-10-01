import React, { useState, useRef } from 'react';
import { Icon, LabeledInput, StyledSelect } from 'components';
import { useOnboarding } from 'hooks';
import { SettingsProps } from './Settings.interface';
import styles from './Settings.module.scss';

/**
 * Settings presenter component - handles UI rendering for user settings page
 *
 * @param props - Component properties
 * @returns React component
 */
const Settings: React.FC<SettingsProps> = ({
  user,
  isLoading,
  error,
  onUpdateSettings,
  isUpdating,
  onUploadPhoto,
  onDeletePhoto,
  isPhotoUploading,
}) => {
  // Get access to the onboarding trigger function
  const { triggerOnboarding } = useOnboarding();
  // Initialize state for notification preferences
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    marketingEmails: true,
  });

  // Initialize state for privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    showProfile: true,
    showContactInfo: false,
    shareActivityData: true,
  });

  // Initialize state for password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Track password form errors
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Reference to the file input element
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize state for general settings
  const [settings, setSettings] = useState({
    emailFrequency: 'immediate',
    pushFrequency: 'enabled',
    language: 'en',
    timezone: 'Europe/Amsterdam',
  });

  // Handle notification toggle changes
  const handleNotificationToggle = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => {
      const updated = { ...prev, [setting]: !prev[setting] };
      // Update settings on server when changed
      onUpdateSettings({ notifications: updated });
      return updated;
    });
  };

  // Handle privacy toggle changes
  const handlePrivacyToggle = (setting: keyof typeof privacySettings) => {
    setPrivacySettings(prev => {
      const updated = { ...prev, [setting]: !prev[setting] };
      // Update settings on server when changed
      onUpdateSettings({ privacy: updated });
      return updated;
    });
  };

  // Handle password form input changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value,
    }));
    setPasswordError(null); // Clear any errors when user types
  };

  // Handle password change submission
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password inputs
    if (passwordData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    // Send password update request
    onUpdateSettings({
      account: {
        password: passwordData,
      },
    });

    // Clear form on successful submission
    if (!error) {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  };

  // Handle file selection for profile photo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadPhoto) {
      onUploadPhoto(file);
    }
  };

  // Trigger file input click
  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Handle photo delete
  const handleDeletePhoto = () => {
    if (onDeletePhoto) {
      onDeletePhoto();
    }
  };

  // Handle general settings input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value,
    }));
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
            Loading settings...
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.section}>
          <div className={styles.errorMessage}>Please log in to view your settings.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Settings</h1>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.section}>
        <h2>Profile Photo</h2>

        <div className={styles.photoUploadContainer}>
          <div className={styles.profilePhotoWrapper}>
            {user?.profile?.avatar_url ? (
              <img src={user.profile.avatar_url} alt="Profile" className={styles.profilePhoto} />
            ) : (
              <div className={styles.photoPlaceholder}>
                <Icon name="user" phosphor="User" weight="light" width={48} />
              </div>
            )}
          </div>

          <div className={styles.photoActions}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />

            <button
              className={styles.photoButton}
              onClick={handleUploadButtonClick}
              disabled={isPhotoUploading}
            >
              {isPhotoUploading ? (
                <>
                  <Icon
                    name="circle-notch"
                    phosphor="CircleNotch"
                    weight="light"
                    width={16}
                    className={styles.spinnerIcon}
                  />
                  Uploading...
                </>
              ) : (
                <>
                  <Icon name="upload" phosphor="Upload" weight="light" width={16} />
                  {user?.profile?.avatar_url ? 'Change Photo' : 'Upload Photo'}
                </>
              )}
            </button>

            {user?.profile?.avatar_url && (
              <button
                className={`${styles.photoButton} ${styles.deleteButton}`}
                onClick={handleDeletePhoto}
                disabled={isPhotoUploading}
              >
                <Icon name="trash" phosphor="Trash" weight="light" width={16} />
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* New side-by-side layout for Notification and Privacy settings */}
      <div className={styles.settingsRow}>
        {/* Notification Preferences Column */}
        <div className={styles.settingsCol}>
          <h2>Notification Preferences</h2>

          <div className={styles.switchLabel}>
            <div className={styles.labelText}>
              <span className={styles.settingTitle}>Email Alerts</span>
              <span className={styles.settingDescription}>
                Receive important alerts about your properties via email
              </span>
            </div>
            <label className={styles.switchControl}>
              <input
                type="checkbox"
                checked={notificationSettings.emailAlerts}
                onChange={() => handleNotificationToggle('emailAlerts')}
                disabled={isUpdating}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.switchLabel}>
            <div className={styles.labelText}>
              <span className={styles.settingTitle}>SMS Notifications</span>
              <span className={styles.settingDescription}>Get timely updates via text message</span>
            </div>
            <label className={styles.switchControl}>
              <input
                type="checkbox"
                checked={notificationSettings.smsAlerts}
                onChange={() => handleNotificationToggle('smsAlerts')}
                disabled={isUpdating}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.switchLabel}>
            <div className={styles.labelText}>
              <span className={styles.settingTitle}>Marketing Emails</span>
              <span className={styles.settingDescription}>
                Receive newsletters and promotional offers
              </span>
            </div>
            <label className={styles.switchControl}>
              <input
                type="checkbox"
                checked={notificationSettings.marketingEmails}
                onChange={() => handleNotificationToggle('marketingEmails')}
                disabled={isUpdating}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>

        {/* Privacy Settings Column */}
        <div className={styles.settingsCol}>
          <h2>Privacy Settings</h2>

          <div className={styles.switchLabel}>
            <div className={styles.labelText}>
              <span className={styles.settingTitle}>Public Profile</span>
              <span className={styles.settingDescription}>
                Allow other users to view your profile
              </span>
            </div>
            <label className={styles.switchControl}>
              <input
                type="checkbox"
                checked={privacySettings.showProfile}
                onChange={() => handlePrivacyToggle('showProfile')}
                disabled={isUpdating}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.switchLabel}>
            <div className={styles.labelText}>
              <span className={styles.settingTitle}>Contact Information</span>
              <span className={styles.settingDescription}>
                Allow others to see your contact information
              </span>
            </div>
            <label className={styles.switchControl}>
              <input
                type="checkbox"
                checked={privacySettings.showContactInfo}
                onChange={() => handlePrivacyToggle('showContactInfo')}
                disabled={isUpdating}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.switchLabel}>
            <div className={styles.labelText}>
              <span className={styles.settingTitle}>Activity Sharing</span>
              <span className={styles.settingDescription}>
                Share your activity data for personalized recommendations
              </span>
            </div>
            <label className={styles.switchControl}>
              <input
                type="checkbox"
                checked={privacySettings.shareActivityData}
                onChange={() => handlePrivacyToggle('shareActivityData')}
                disabled={isUpdating}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
      </div>

      <section className={styles.section}>
        <h2>Notification Preferences</h2>

        <div className={styles.formGroup}>
          <LabeledInput id="emailNotifications" label="Email Notifications">
            <StyledSelect>
              <select
                name="emailFrequency"
                value={settings.emailFrequency}
                onChange={handleInputChange}
              >
                <option value="immediate">Immediate</option>
                <option value="daily">Daily Digest</option>
                <option value="weekly">Weekly Summary</option>
                <option value="disabled">Disabled</option>
              </select>
            </StyledSelect>
          </LabeledInput>

          <LabeledInput id="pushNotifications" label="Push Notifications">
            <StyledSelect>
              <select
                name="pushFrequency"
                value={settings.pushFrequency}
                onChange={handleInputChange}
              >
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </StyledSelect>
          </LabeledInput>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Language & Region</h2>

        <div className={styles.formGroup}>
          <LabeledInput id="language" label="Language">
            <StyledSelect>
              <select name="language" value={settings.language} onChange={handleInputChange}>
                <option value="en">English</option>
                <option value="nl">Dutch</option>
                <option value="de">German</option>
                <option value="fr">French</option>
              </select>
            </StyledSelect>
          </LabeledInput>

          <LabeledInput id="timezone" label="Timezone">
            <StyledSelect>
              <select name="timezone" value={settings.timezone} onChange={handleInputChange}>
                <option value="Europe/Amsterdam">Amsterdam (CET)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="America/New_York">New York (EST)</option>
              </select>
            </StyledSelect>
          </LabeledInput>
        </div>
      </section>

      <div className={styles.section}>
        <h2>Housing Preferences</h2>
        <p>You can update your housing journey preferences at any time</p>

        <div className={styles.formActions} style={{ marginTop: '20px' }}>
          <button
            onClick={() => triggerOnboarding()}
            className={styles.saveButton}
            style={{ backgroundColor: '#F4C77B', color: '#3A4F41' }}
          >
            <Icon name="gear" phosphor="Gear" weight="light" width={16} />
            Customize My Journey (Restart Onboarding)
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Password</h2>

        <form onSubmit={handlePasswordSubmit} className={styles.passwordForm}>
          <LabeledInput
            id="current-password"
            label="Current Password"
            icon={{
              object: () => (
                <Icon name="lock" phosphor="Lock" weight="light" width={20} color="#3A4F41" />
              ),
            }}
          >
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </LabeledInput>

          <LabeledInput
            id="new-password"
            label="New Password"
            icon={{
              object: () => (
                <Icon
                  name="lock-key"
                  phosphor="LockKey"
                  weight="light"
                  width={20}
                  color="#3A4F41"
                />
              ),
            }}
          >
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
              minLength={8}
            />
          </LabeledInput>

          <LabeledInput
            id="confirm-password"
            label="Confirm New Password"
            icon={{
              object: () => (
                <Icon
                  name="lock-key"
                  phosphor="LockKey"
                  weight="light"
                  width={20}
                  color="#3A4F41"
                />
              ),
            }}
          >
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
          </LabeledInput>

          {passwordError && <div className={styles.errorMessage}>{passwordError}</div>}

          <div className={styles.formActions}>
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
                  Updating...
                </>
              ) : (
                <>
                  <Icon name="lock-key" phosphor="LockKey" weight="light" width={16} />
                  Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
