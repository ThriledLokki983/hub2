import React, { useState } from 'react';
import { UserProfileProps } from './UserProfile.interface';
import styles from './UserProfile.module.scss';
import { Button } from 'components';

/**
 * UserProfile presenter component - handles only UI rendering
 *
 * This is a demonstration of the presenter component in the Container/Presenter pattern
 * It receives data and callbacks from its container component
 *
 * @param props Component properties
 * @returns React component
 */
const UserProfile: React.FC<UserProfileProps> = ({
  user,
  isLoading,
  error,
  onUpdate,
  isUpdating,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  // Start editing user data
  const handleEditClick = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
      setIsEditing(true);
    }
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit updated user data
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading user profile...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!user) {
    return <div className={styles.empty}>No user data available</div>;
  }

  return (
    <div className={styles.userProfile}>
      <h2 className={styles.title}>User Profile</h2>

      {isEditing ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              disabled={isUpdating}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isUpdating}
            />
          </div>

          <div className={styles.field}>
            <label>Role</label>
            <span>{user.role}</span>
          </div>

          <div className={styles.actions}>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button type="button" variant="secondary" onClick={handleCancel} disabled={isUpdating}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <>
          <div className={styles.field}>
            <label>Name</label>
            <span>{user.name}</span>
          </div>

          <div className={styles.field}>
            <label>Email</label>
            <span>{user.email}</span>
          </div>

          <div className={styles.field}>
            <label>Role</label>
            <span>{user.role}</span>
          </div>

          <div className={styles.actions}>
            <Button onClick={handleEditClick}>Edit Profile</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;
