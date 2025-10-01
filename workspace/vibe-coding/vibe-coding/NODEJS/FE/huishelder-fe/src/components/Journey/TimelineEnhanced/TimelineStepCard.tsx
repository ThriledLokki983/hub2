import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button, CustomSelect } from 'components';
import { TimelineStepCardProps } from './shared';
import styles from './TimelineStepCard.module.scss';
import classNames from 'classnames';

const TimelineStepCard: React.FC<TimelineStepCardProps> = ({
  step,
  onStatusChange,
  onNotesChange,
  isExpanded = false,
  onToggleExpand,
}) => {
  const [notes, setNotes] = useState(step.notes || '');

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (e) {
      return '';
    }
  };

  const handleStatusChange = (status: string) => {
    if (onStatusChange) {
      onStatusChange(step.id, status);
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const handleNotesSave = () => {
    if (onNotesChange) {
      onNotesChange(step.id, notes);
    }
  };

  const getStatusOptions = () => [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const toggleExpand = () => {
    if (onToggleExpand) {
      onToggleExpand(step.id);
    }
  };

  return (
    <div className={classNames(styles.stepCard, styles[step.status])}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{step.title}</h3>
          {step.category && (
            <span className={classNames(styles.category, styles[step.category])}>
              {step.category}
            </span>
          )}
        </div>

        <div className={styles.metaRow}>
          <div className={styles.dueDate}>
            {step.due_date && (
              <>
                <span className={styles.dateLabel}>Due:</span>
                <span className={styles.date}>{formatDate(step.due_date)}</span>
              </>
            )}
          </div>

          <div className={styles.statusSelect}>
            <CustomSelect
              options={getStatusOptions()}
              value={step.status}
              onChange={handleStatusChange}
              label="Status"
            />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className={styles.expandedContent}>
          <div className={styles.description}>{step.description}</div>

          {step.dependencies && step.dependencies.length > 0 && (
            <div className={styles.dependencies}>
              <h4 className={styles.sectionTitle}>Dependencies</h4>
              <ul className={styles.dependencyList}>
                {step.dependencies.map(depId => (
                  <li key={depId} className={styles.dependencyItem}>
                    {depId}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={styles.notes}>
            <h4 className={styles.sectionTitle}>Notes</h4>
            <textarea
              className={styles.notesInput}
              value={notes}
              onChange={handleNotesChange}
              placeholder="Add notes here..."
              rows={4}
            ></textarea>
            <div className={styles.notesActions}>
              <Button variation="secondary" size="small" onClick={handleNotesSave}>
                Save Notes
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.footer}>
        <button className={styles.expandButton} onClick={toggleExpand}>
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      </div>
    </div>
  );
};

export default TimelineStepCard;
