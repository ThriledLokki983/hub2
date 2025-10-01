import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { PATH_LOGIN, PATH_SIGNUP, PATH_FINANCIAL_DASHBOARD } from 'configs/paths';
import { ProfileDropdownProps, DropdownItemProps } from './ProfileDropdown.interface';
import styles from './ProfileDropdown.module.scss';

/**
 * ProfileIcon SVG component
 */
const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
      clipRule="evenodd"
    />
  </svg>
);

/**
 * DropdownItem component
 */
const DropdownItem = ({ icon, label, onClick, to }: DropdownItemProps) => {
  // Create the icon element if provided
  const iconElement = icon ? (
    <svg className={styles.icon}>
      <use xlinkHref={`#icon-${icon}`} />
    </svg>
  ) : null;

  // If "to" is provided, render a Link, otherwise render a button
  if (to) {
    return (
      <li className={styles.dropdownItem}>
        <Link to={to}>
          {iconElement}
          {label}
        </Link>
      </li>
    );
  }

  return (
    <li className={styles.dropdownItem}>
      <button onClick={onClick}>
        {iconElement}
        {label}
      </button>
    </li>
  );
};

/**
 * ProfileDropdown component - An elegant user account dropdown
 * that follows the HuisHelder design system.
 */
const ProfileDropdown = ({
  isLoggedIn,
  userName = '',
  userEmail = '',
  onLogin,
  onSignup,
  onLogout,
  children,
}: ProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Generate user initials for the avatar
  const getInitials = () => {
    if (!userName) return '';

    const names = userName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }

    return userName.substring(0, 2).toUpperCase();
  };

  // Manually combine classes without using classnames library
  const getProfileIconClasses = () => {
    return isOpen ? `${styles.profileIcon} ${styles.active}` : styles.profileIcon;
  };

  const getDropdownClasses = () => {
    return isOpen ? `${styles.dropdown} ${styles.open}` : styles.dropdown;
  };

  return (
    <div className={styles.wrapper} ref={dropdownRef}>
      <button
        className={styles.profileButton}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Profile menu"
      >
        <div className={getProfileIconClasses()}>
          {isLoggedIn && userName ? getInitials() : <ProfileIcon />}
        </div>
      </button>

      <div className={getDropdownClasses()}>
        {isLoggedIn ? (
          <>
            <div className={styles.header}>
              <div className={styles.userName}>{userName}</div>
              <div className={styles.userEmail}>{userEmail}</div>
            </div>
            <ul className={styles.dropdownList}>
              <DropdownItem label="My Profile" to="/profile" />
              <DropdownItem label="Settings" to="/settings" />
              <DropdownItem label="My Properties" to="/properties" />
              <DropdownItem label="Financial Dashboard" to={PATH_FINANCIAL_DASHBOARD} />
              <div className={styles.divider}></div>
              <DropdownItem label="Logout" onClick={onLogout} />
            </ul>
          </>
        ) : (
          <ul className={styles.dropdownList}>
            <DropdownItem label="Login" onClick={onLogin} to={PATH_LOGIN} />
            <DropdownItem label="Sign Up" onClick={onSignup} to={PATH_SIGNUP} />
          </ul>
        )}

        {children}
      </div>
    </div>
  );
};

export default ProfileDropdown;
