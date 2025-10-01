import React, { useState } from 'react';
import { format } from 'date-fns';
import { TimelineProps } from './Timeline.interface';
import styles from './Timeline.module.scss';
import classNames from 'classnames';

const Timeline: React.FC<TimelineProps> = ({
  milestones,
  currentMilestoneId,
  expandedByDefault = false,
}) => {
  const [expandedMilestones, setExpandedMilestones] = useState<{ [key: string]: boolean }>(
    milestones.reduce(
      (acc, milestone) => {
        acc[milestone.id] = expandedByDefault || milestone.id === currentMilestoneId;
        return acc;
      },
      {} as { [key: string]: boolean },
    ),
  );

  const toggleMilestone = (milestoneId: string) => {
    setExpandedMilestones(prev => ({
      ...prev,
      [milestoneId]: !prev[milestoneId],
    }));
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (e) {
      return '';
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'in_progress':
        return '⋯';
      case 'pending':
      default:
        return '';
    }
  };

  return (
    <div className={styles.sectionContainer}>
      <h2 className={styles.sectionTitle}>Uw huisreis</h2>
      <div className={styles.timelineContainer}>
        {milestones.map((milestone, index) => (
          <div className={styles.timelineItem} key={milestone.id}>
            {index < milestones.length - 1 && <div className={styles.timelineConnector} />}
            <div
              className={classNames(styles.statusBadge, styles[milestone.status])}
              aria-label={`Mijlpaal status: ${milestone.status}`}
            >
              {getStatusIcon(milestone.status)}
            </div>
            <div className={styles.milestoneCard}>
              <div className={styles.milestoneTitle}>
                {milestone.title}
                {milestone.id === currentMilestoneId && (
                  <div className={styles.currentIndicator}>Huidige stap</div>
                )}
              </div>

              <div className={styles.milestoneDate}>
                {milestone.date && formatDate(milestone.date)}
              </div>

              {expandedMilestones[milestone.id] && (
                <>
                  <div className={styles.milestoneDescription}>{milestone.description}</div>

                  {milestone.tasks && milestone.tasks.length > 0 && (
                    <>
                      <div className={styles.milestoneDivider} />
                      <ul>
                        {milestone.tasks.map(task => (
                          <li key={task.id}>
                            {task.title}
                            {task.status === 'done' && ' ✓'}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {milestone.nextSteps && (
                    <>
                      <div className={styles.milestoneDivider} />
                      <p>
                        <strong>Volgende stappen:</strong>
                      </p>
                      <p>{milestone.nextSteps}</p>
                    </>
                  )}
                </>
              )}

              <div className={styles.milestoneActions}>
                <button
                  className={styles.expandButton}
                  onClick={() => toggleMilestone(milestone.id)}
                  aria-expanded={expandedMilestones[milestone.id]}
                >
                  {expandedMilestones[milestone.id] ? 'Minder tonen' : 'Meer tonen'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
