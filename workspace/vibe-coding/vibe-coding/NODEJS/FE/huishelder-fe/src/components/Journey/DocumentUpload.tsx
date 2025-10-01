import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import classNames from 'classnames';
import styles from './DocumentUpload.module.scss';
import { UploadIcon, DocumentIcon, CloseIcon } from './icons';

interface DocumentUploadProps {
  onUpload: (file: File, taskId?: string, milestoneId?: string) => Promise<unknown>;
  uploadProgress: number;
  relatedTaskId?: string;
  relatedMilestoneId?: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onUpload,
  uploadProgress,
  relatedTaskId,
  relatedMilestoneId,
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      await onUpload(selectedFile, relatedTaskId, relatedMilestoneId);
      clearSelectedFile();
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    if (!selectedFile && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={styles.documentUploadContainer}>
      <div
        className={classNames(styles.fileUploadArea, {
          [styles.dragging]: isDragging,
          [styles.uploading]: isUploading,
          [styles.hasFile]: selectedFile !== null,
        })}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleUploadClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className={styles.hiddenFileInput}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          disabled={selectedFile !== null}
          data-hidden
        />
        {isUploading ? (
          <div className={styles.uploadingIndicator}>
            <div className={styles.progressBar} style={{ width: `${uploadProgress}%` }} />
            <p>Bezig met uploaden... {uploadProgress}%</p>
          </div>
        ) : selectedFile ? (
          <div className={styles.selectedFileInfo}>
            <div className={styles.selectedFileName}>
              <span className={styles.fileIcon}>
                <DocumentIcon />
              </span>
              <span>{selectedFile.name}</span>
            </div>
            <div className={styles.fileActions}>
              <button
                className={classNames(styles.button, styles.clearButton)}
                onClick={e => {
                  e.stopPropagation();
                  clearSelectedFile();
                }}
              >
                <CloseIcon />
                <span>Verwijderen</span>
              </button>
              <button
                className={classNames(styles.button, styles.uploadButton)}
                onClick={e => {
                  e.stopPropagation();
                  handleFileUpload();
                }}
              >
                <UploadIcon />
                <span>Uploaden</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.uploadIcon}>
              <UploadIcon />
            </div>
            <p>Sleep uw bestanden hierheen of klik om te bladeren</p>
            <p className={styles.uploadHint}>Ondersteunde formaten: PDF, DOC, DOCX, JPG, PNG</p>
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentUpload;
