import React from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import styles from './ButtonRedesigned.module.scss';

export interface ButtonRedesignedProps {
  /** Button type */
  type?: 'button' | 'submit' | 'reset';
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'accent' | 'text';
  /** Button size */
  size?: 'small' | 'medium' | 'large';
  /** Whether the button is disabled */
  disabled?: boolean;
  /** URL to navigate to (makes button an anchor) */
  url?: string;
  /** Handler for click events */
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  /** Button content */
  children: React.ReactNode;
  /** Icon to display (optional) */
  icon?: React.ReactNode;
  /** Whether to place icon after text instead of before */
  iconAfter?: boolean;
  /** Whether button should take full width of container */
  fullWidth?: boolean;
  /** Additional class names */
  className?: string;
  /** Any other props */
  [x: string]: any;
}

/**
 * Modern button component for HuisHelder design system
 */
const ButtonRedesigned = ({
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  url = '',
  onClick = () => null,
  children,
  icon,
  iconAfter = false,
  fullWidth = false,
  className,
  ...props
}: ButtonRedesignedProps) => {
  const navigate = useNavigate();

  // Check if URL is internal
  const isInternal =
    !url ||
    url.startsWith('/') ||
    (url.includes('://') && new URL(url).origin === window.location.origin);

  // Handle clicks
  const handleClick = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    onClick(event);

    // Skip for meta key clicks (e.g., opening in new tab)
    if (url && event.metaKey) {
      return;
    }

    // Use router navigation for internal URLs
    if (url && isInternal) {
      event.preventDefault();
      navigate(url);
    }
  };

  // Common props for both button and anchor
  const commonProps = {
    className: classNames(styles.button, className),
    disabled: disabled,
    'data-disabled': disabled ? 'true' : 'false',
    'data-variant': variant,
    'data-size': size,
    'data-has-icon': icon ? 'true' : 'false',
    'data-full-width': fullWidth ? 'true' : 'false',
    onClick: handleClick,
    ...props,
  };

  // Render content with icon
  const renderContent = () => {
    if (!icon) return children;

    return (
      <>
        {!iconAfter && icon}
        {children}
        {iconAfter && icon}
      </>
    );
  };

  // Render as anchor if URL is provided
  if (url) {
    return (
      <a
        href={url}
        target={!isInternal ? '_blank' : undefined}
        rel={!isInternal ? 'noopener noreferrer' : undefined}
        {...commonProps}
      >
        {renderContent()}
      </a>
    );
  }

  // Render as button
  return (
    <button type={type} {...commonProps}>
      {renderContent()}
    </button>
  );
};

export default ButtonRedesigned;
