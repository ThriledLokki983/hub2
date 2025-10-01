import React, { useState } from 'react';
import { format } from 'date-fns';
import { TaskListProps } from './TaskList.interface';
import { Task, TaskStatus } from '../../hooks/interfaces/journey';
import styles from './TaskList.module.scss';
import classNames from 'classnames';
import TaskUploadModal from './TaskUploadModal';
import { UploadIcon, CalendarIcon, AttachmentIcon, CheckIcon } from './icons';

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskComplete,
  showMilestoneInfo = false,
  title = 'Uw openstaande taken',
  requiredDocuments = [],
  onUpload,
  uploadProgress = 0,
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Process tasks to normalize status values across different formats (API vs. component formats)
  const processedTasks = tasks.map(task => {
    // Force pending status for any empty or invalid status
    if (!task.status) {
      return { ...task, status: 'pending' as TaskStatus };
    }

    // Convert string statuses like "DONE", "COMPLETE", or "PENDING" to proper lowercase values
    if (typeof task.status === 'string' && task.status.toUpperCase) {
      const upperStatus = task.status.toUpperCase();
      if (upperStatus === 'DONE' || upperStatus === 'COMPLETE') {
        return { ...task, status: 'done' as TaskStatus };
      } else if (upperStatus === 'PENDING') {
        return { ...task, status: 'pending' as TaskStatus };
      } else if (upperStatus === 'IN_PROGRESS') {
        return { ...task, status: 'in_progress' as TaskStatus };
      }
    }

    // Ensure all other tasks have a valid status, default to pending if not
    const validStatuses = ['pending', 'in_progress', 'done'];
    if (!validStatuses.includes(String(task.status))) {
      return { ...task, status: 'pending' as TaskStatus };
    }

    return task;
  });

  // Sort tasks primarily by due date, but keeping the original order within the same date
  const sortedTasks = [...processedTasks].sort((a, b) => {
    // Sort by due date if both have dates
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }

    // Tasks with due dates come before those without
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;

    return 0;
  });

  const handleTaskComplete = async (taskId: string) => {
    if (onTaskComplete) {
      await onTaskComplete(taskId);
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (e) {
      return '';
    }
  };

  const isUploadTask = (task: Task): boolean => {
    return task.title.toLowerCase().includes('upload');
  };

  const hasDocuments = (task: Task): boolean => {
    return Boolean(task.relatedDocuments && task.relatedDocuments.length > 0);
  };

  return (
    <div className={styles.taskListContainer}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {sortedTasks.length === 0 ? (
        <p className={styles.emptyState}>Er zijn momenteel geen taken voor u.</p>
      ) : (
        sortedTasks.map(task => (
          <div
            className={`${styles.taskItem} ${task.status === 'done' ? styles.completedTask : ''}`}
            key={task.id}
          >
            <input
              type="checkbox"
              className={styles.taskCheckbox}
              checked={task.status === 'done'}
              readOnly
              disabled
            />
            <div className={styles.taskContent}>
              <div
                className={classNames(styles.taskTitle, {
                  [styles.completed]:
                    task.status === 'done' || task.status.toUpperCase?.() === 'DONE',
                })}
              >
                {task.title}
                {(task.status === 'done' || task.status.toUpperCase?.() === 'DONE') && (
                  <span className={styles.taskStatusLabel}>(Voltooid)</span>
                )}
              </div>
              <div className={styles.taskMeta}>
                {task.dueDate && (
                  <span
                    className={classNames(styles.taskDueDate, {
                      [styles.overdue]:
                        new Date(task.dueDate) < new Date() && task.status !== 'done',
                    })}
                  >
                    <CalendarIcon /> {formatDate(task.dueDate)}
                  </span>
                )}
                {showMilestoneInfo && task.milestoneName && (
                  <span className={styles.taskMilestone}>{task.milestoneName}</span>
                )}
                {hasDocuments(task) && (
                  <span className={styles.documentCount}>
                    <AttachmentIcon /> {task.relatedDocuments?.length} document
                    {task.relatedDocuments && task.relatedDocuments.length !== 1 ? 'en' : ''}
                  </span>
                )}
                {task.status === 'done' && (
                  <span className={styles.completedBadge}>
                    <CheckIcon /> Voltooid
                  </span>
                )}
              </div>
            </div>
            <div>
              {task.status !== 'done' && task.status.toUpperCase?.() !== 'DONE' && (
                <button
                  className={classNames(styles.button, styles.buttonText)}
                  onClick={() => {
                    if (isUploadTask(task)) {
                      setSelectedTask(task);
                      setIsUploadModalOpen(true);
                    } else {
                      handleTaskComplete(task.id);
                    }
                  }}
                >
                  {isUploadTask(task) ? (
                    <>
                      <UploadIcon />
                      <span>Uploaden</span>
                    </>
                  ) : (
                    <>
                      <CheckIcon />
                      <span>Voltooien</span>
                    </>
                  )}
                </button>
              )}
              {(task.status === 'done' || task.status.toUpperCase?.() === 'DONE') && (
                <div className={styles.completedAction}>
                  <CheckIcon />
                  <span>Voltooid</span>
                </div>
              )}
            </div>
          </div>
        ))
      )}

      {selectedTask && onUpload && onTaskComplete && (
        <TaskUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => {
            setIsUploadModalOpen(false);
            setSelectedTask(null);
          }}
          taskId={selectedTask.id}
          milestoneId={selectedTask.milestoneId}
          requiredDocuments={requiredDocuments.filter(doc => doc.taskId === selectedTask.id)}
          onUpload={onUpload}
          onComplete={onTaskComplete}
          uploadProgress={uploadProgress}
          taskTitle={selectedTask.title}
        />
      )}
    </div>
  );
};

export default TaskList;
