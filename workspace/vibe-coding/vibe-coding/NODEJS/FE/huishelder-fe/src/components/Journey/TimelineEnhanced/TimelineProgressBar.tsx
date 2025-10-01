import React from 'react';
import { TimelineProgressBarProps } from './shared';
import styles from './TimelineProgressBar.module.scss';

const TimelineProgressBar: React.FC<TimelineProgressBarProps> = ({
  percentage,
  categoryBreakdown,
}) => {
  return (
    <div className={styles.progressContainer}>
      <div className={styles.overallProgress}>
        <div className={styles.progressHeader}>
          <h3 className={styles.progressTitle}>Overall Progress</h3>
          <span className={styles.percentage}>{Math.round(percentage)}%</span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${percentage}%` }}
            aria-valuenow={Math.round(percentage)}
            aria-valuemin={0}
            aria-valuemax={100}
            role="progressbar"
            aria-label={`Overall completion: ${Math.round(percentage)}%`}
          ></div>
        </div>
      </div>

      <div className={styles.categoryBreakdown}>
        <h4 className={styles.breakdownTitle}>Category Breakdown</h4>
        <div className={styles.categories}>
          <div className={styles.categoryItem}>
            <div className={styles.categoryLabel}>
              <span className={styles.categoryDot} data-category="buying"></span>
              <span>Buying</span>
            </div>
            <div className={styles.categoryProgressBar}>
              <div
                className={styles.categoryProgressFill}
                data-category="buying"
                style={{ width: `${categoryBreakdown.buying}%` }}
                aria-valuenow={Math.round(categoryBreakdown.buying)}
                aria-valuemin={0}
                aria-valuemax={100}
                role="progressbar"
              ></div>
            </div>
            <span className={styles.categoryPercentage}>
              {Math.round(categoryBreakdown.buying)}%
            </span>
          </div>

          <div className={styles.categoryItem}>
            <div className={styles.categoryLabel}>
              <span className={styles.categoryDot} data-category="selling"></span>
              <span>Selling</span>
            </div>
            <div className={styles.categoryProgressBar}>
              <div
                className={styles.categoryProgressFill}
                data-category="selling"
                style={{ width: `${categoryBreakdown.selling}%` }}
                aria-valuenow={Math.round(categoryBreakdown.selling)}
                aria-valuemin={0}
                aria-valuemax={100}
                role="progressbar"
              ></div>
            </div>
            <span className={styles.categoryPercentage}>
              {Math.round(categoryBreakdown.selling)}%
            </span>
          </div>

          <div className={styles.categoryItem}>
            <div className={styles.categoryLabel}>
              <span className={styles.categoryDot} data-category="shared"></span>
              <span>Shared</span>
            </div>
            <div className={styles.categoryProgressBar}>
              <div
                className={styles.categoryProgressFill}
                data-category="shared"
                style={{ width: `${categoryBreakdown.shared}%` }}
                aria-valuenow={Math.round(categoryBreakdown.shared)}
                aria-valuemin={0}
                aria-valuemax={100}
                role="progressbar"
              ></div>
            </div>
            <span className={styles.categoryPercentage}>
              {Math.round(categoryBreakdown.shared)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineProgressBar;
