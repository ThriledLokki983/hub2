import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { ButtonProps } from './Button.interface';

import styles from './Button.module.scss';


const Button = ({
  type = 'button',
  variation = 'primary',
  size = 'regular',
  disabled = false,
  url = '',
  onClick = () => null,
  children,
  ...props
}: ButtonProps) => {

  const navigate = useNavigate();

  /**
   * Check if the (optional) URL is internal.
   */
  const isInternal = useMemo(
    () => !url || url.startsWith('/') || new URL(url).origin === window.location.origin,
    [url]
  );

  /**
   * Handle clicks.
   */
  const clickHandler = (e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    onClick(e);

    // Ignore meta key clicks on anchors (eg. manual new tab).
    if (url && e.metaKey) {
      return;
    }

    // Route internal URLs to our router.
    if (url && isInternal) {
      e.preventDefault();
      navigate(url);
    }
  };

  if (url) {
    return (
      <a
        {...props}
        className={styles.root}
        data-size={size}
        data-variation={variation}
        href={url}
        target={isInternal ? '' : '_blank'}
        rel={isInternal ? '' : 'external noopener noreferrer'}
        onClick={clickHandler}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      {...props}
      className={styles.root}
      type={type}
      data-size={size}
      data-variation={variation}
      onClick={clickHandler}
      disabled={disabled}
    >
      {children}
    </button>
  );

};

export default Button;
