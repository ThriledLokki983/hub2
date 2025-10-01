import React from 'react';
import classNames from 'classnames';
import { DocumentUpload } from '.';
import styles from './TaskUploadModal.module.scss';
import { Document } from '../../hooks/interfaces/journey';

interface TaskUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  milestoneId: string;
  requiredDocuments: Document[];
  onUpload: (file: File, taskId?: string, milestoneId?: string) => Promise<unknown>;
  onComplete: (taskId: string) => Promise<void>;
  uploadProgress: number;
  taskTitle: string;
}

const TaskUploadModal: React.FC<TaskUploadModalProps> = ({
  isOpen,
  onClose,
  taskId,
  milestoneId,
  requiredDocuments,
  onUpload,
  onComplete,
  uploadProgress,
  taskTitle,
}) => {
  if (!isOpen) return null;

  const handleUpload = async (file: File) => {
    try {
      // First attempt the upload
      const uploadResult = await onUpload(file, taskId, milestoneId);

      // Only attempt to complete the task if we got a successful upload response
      if (uploadResult) {
        try {
          await onComplete(taskId);
          onClose();
        } catch (completeError) {
          console.error('Error completing task:', completeError);
        }
      } else {
        console.error('Document upload failed - no response data');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{taskTitle}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.modalContent}>
          <DocumentUpload
            documents={requiredDocuments}
            onUpload={handleUpload}
            uploadProgress={uploadProgress}
            relatedTaskId={taskId}
            relatedMilestoneId={milestoneId}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskUploadModal;
