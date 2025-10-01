import React from 'react';
import { ResultCardProps } from './FinancialDashboard.interface';
import styles from './DashboardContainer.module.scss';
import classNames from 'classnames';

/**
 * Result Card Component
 * Displays a financial metric in a styled card with optional status indicator
 */
const ResultCard: React.FC<ResultCardProps> = ({
  title,
  value,
  description,
  status = 'info',
  className,
}) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={classNames(styles.resultCard, className)}>
      {/* Status indicator strip */}
      <div className={classNames(styles.statusIndicator, styles[status])} />

      <h3 className={styles.cardTitle}>{title}</h3>
      <div className={styles.cardValue}>{formatCurrency(value)}</div>
      {description && <p className={styles.cardDescription}>{description}</p>}
    </div>
  );
};

export default ResultCard;
