import React from 'react';
import { Icon } from 'components';
import { TimelineProps } from './Timeline.interface';
import styles from './Timeline.module.scss';

const Timeline: React.FC<TimelineProps> = ({ steps, isLoading, error, onStepComplete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Icon
            name="circle-notch"
            phosphor="CircleNotch"
            weight="light"
            width={24}
            className={styles.spinnerIcon}
          />
          Loading timeline...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <Icon name="warning" phosphor="Warning" weight="light" width={24} /> {error}
        </div>
      </div>
    );
  }

  if (!steps?.length) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>No timeline steps found. Please check back later.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Your Home-Buying Timeline</h1>
        <p>Track your progress through each step of your home-buying journey</p>
        <div className={styles.enhancedLink}>
          <a href="/timeline/enhanced" className={styles.enhancedButton}>
            Try Enhanced Timeline
          </a>
        </div>
      </header>

      <div className={styles.timelineList}>
        {steps.map(step => (
          <div key={step.step_id} className={`${styles.step} ${styles[step.status]}`}>
            <div className={styles.stepContent}>
              <div className={styles.stepHeader}>
                <div className={styles.stepInfo}>
                  <h3 className={styles.stepName}>{step.name}</h3>
                  <div className={styles.stepDate}>
                    Due: {formatDate(step.due_date)}
                    {step.completed_at && <> · Completed: {formatDate(step.completed_at)}</>}
                  </div>
                </div>
                <span className={`${styles.statusBadge} ${styles[step.status]}`}>
                  {step.status.replace('_', ' ')}
                </span>
              </div>

              {step.description && <p>{step.description}</p>}

              {step.status !== 'completed' && (
                <button
                  className={styles.completeButton}
                  onClick={() => step.step_id && onStepComplete(step.step_id)}
                >
                  <Icon name="check" phosphor="Check" weight="light" width={16} /> Mark as Complete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
