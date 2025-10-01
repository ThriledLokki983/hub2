import React from 'react';
import { DocumentUpload } from './';

interface DocumentUploadWrapperProps {
  documents: any[]; // Use appropriate type from your app
  onUpload: (file: File, taskId?: string, milestoneId?: string) => Promise<unknown>;
  uploadProgress: number;
}

/**
 * DocumentUploadWrapper
 *
 * A wrapper around the DocumentUpload component to ensure type compatibility
 */
const DocumentUploadWrapper: React.FC<DocumentUploadWrapperProps> = ({
  documents,
  onUpload,
  uploadProgress,
}) => {
  return <DocumentUpload onUpload={onUpload} uploadProgress={uploadProgress} />;
};

export default DocumentUploadWrapper;
