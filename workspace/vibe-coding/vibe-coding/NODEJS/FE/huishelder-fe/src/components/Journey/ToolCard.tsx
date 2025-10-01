import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ToolCard.module.scss';
import classNames from 'classnames';

export interface ToolCardProps {
  title: string;
  description: string;
  icon: string;
  to: string;
  className?: string;
  status?: 'pending' | 'completed';
  onClick?: () => void; // Optional callback when card is clicked
  state?: Record<string, unknown>; // Optional state to pass to the Link component
}

/**
 * ToolCard Component
 * Displays a special card for tools/features that enhance the user journey
 */
const ToolCard: React.FC<ToolCardProps> = ({
  title,
  description,
  icon,
  to,
  className,
  status = 'pending',
  onClick,
  state,
}) => {
  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <Link
      to={to}
      state={state}
      className={classNames(styles.toolCard, styles[status], className)}
      onClick={handleClick}
    >
      <div className={styles.toolIcon}>{icon}</div>
      <div className={styles.toolContent}>
        <h4 className={styles.toolTitle}>
          {title}
          {status === 'completed' && <span className={styles.completedBadge}>✓ Gebruikt</span>}
        </h4>
        <p className={styles.toolDescription}>{description}</p>
      </div>
      <div className={styles.toolAction}>
        <span className={styles.actionIcon}>→</span>
      </div>
    </Link>
  );
};

export default ToolCard;
