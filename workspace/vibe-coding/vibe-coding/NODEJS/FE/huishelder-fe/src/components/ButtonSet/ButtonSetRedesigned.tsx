import React from 'react';
import classNames from 'classnames';
import styles from './ButtonSetRedesigned.module.scss';

export interface ButtonSetRedesignedProps {
  /** Direction of the buttons */
  direction?: 'horizontal' | 'vertical';
  /** Horizontal alignment of buttons */
  alignment?: 'left' | 'center' | 'right';
  /** Whether all buttons should have equal width */
  equalWidth?: boolean;
  /** Child buttons */
  children: React.ReactNode;
  /** Additional class name */
  className?: string;
}

/**
 * Layout component for grouping buttons with consistent spacing
 */
const ButtonSetRedesigned: React.FC<ButtonSetRedesignedProps> = ({
  direction = 'horizontal',
  alignment = 'left',
  equalWidth = false,
  children,
  className,
}) => {
  return (
    <div
      className={classNames(styles.buttonSet, className)}
      data-direction={direction}
      data-alignment={alignment}
      data-equal-width={equalWidth ? 'true' : 'false'}
    >
      {children}
    </div>
  );
};

export default ButtonSetRedesigned;
