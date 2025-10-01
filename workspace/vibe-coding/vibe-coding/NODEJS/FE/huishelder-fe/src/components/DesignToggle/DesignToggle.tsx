import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './DesignToggle.module.scss';

interface DesignToggleProps {
  className?: string;
}

/**
 * A floating toggle button that allows switching between the original and redesigned UI
 * Only visible in development mode
 */
const DesignToggle: React.FC<DesignToggleProps> = ({ className }) => {
  // Get current UI mode
  const [isRedesigned, setIsRedesigned] = useState<boolean>(
    import.meta.env.VITE_USE_REDESIGNED === 'true',
  );

  // Check if in development mode
  const isDev = import.meta.env.VITE_APP_ENV === 'development';

  const toggleDesignMode = useCallback(() => {
    const newMode = !isRedesigned;
    setIsRedesigned(newMode);

    // Store preference in localStorage for persistence across page reloads
    localStorage.setItem('useRedesignedUI', String(newMode));

    // Reload the page to apply the changes
    window.location.reload();
  }, [isRedesigned]);

  // Set up local storage and URL param effects
  useEffect(() => {
    // Check for stored preference
    const storedPreference = localStorage.getItem('useRedesignedUI');
    if (storedPreference !== null) {
      const preferenceValue = storedPreference === 'true';
      if (preferenceValue !== isRedesigned) {
        setIsRedesigned(preferenceValue);
      }
    }

    // Check for URL parameter ?design=new or ?design=old
    const params = new URLSearchParams(window.location.search);
    const designParam = params.get('design');
    if (designParam === 'new') {
      setIsRedesigned(true);
      localStorage.setItem('useRedesignedUI', 'true');
    } else if (designParam === 'old') {
      setIsRedesigned(false);
      localStorage.setItem('useRedesignedUI', 'false');
    }
  }, []);

  // Only render in development mode
  if (!isDev) return null;

  return (
    <button
      className={classNames(styles.designToggle, { [styles.original]: !isRedesigned }, className)}
      onClick={toggleDesignMode}
      data-dev={isDev ? 'true' : 'false'}
      title={`Switch to ${isRedesigned ? 'original' : 'redesigned'} UI`}
    >
      <span className={styles.icon}>{isRedesigned ? '⚡️' : '🏠'}</span>
      {isRedesigned ? 'Original UI' : 'New Design'}
    </button>
  );
};

export default DesignToggle;
