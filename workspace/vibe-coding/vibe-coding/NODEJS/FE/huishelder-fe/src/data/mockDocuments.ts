import { Document, DocumentStatus } from '../hooks/interfaces/journey';

/**
 * Mock data for the document upload component
 * This is used when the API is not available or in development mode
 */
export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    name: 'Concept koopovereenkomst.pdf',
    type: 'pdf',
    status: 'uploaded' as DocumentStatus,
    uploadDate: new Date(2025, 4, 12).toISOString(),
    fileUrl: '#',
    taskId: 'task-4',
    milestoneId: 'milestone-2',
  },
  {
    id: 'doc-2',
    name: 'Getekende koopovereenkomst',
    type: 'pdf',
    status: 'required' as DocumentStatus,
    taskId: 'task-4',
    milestoneId: 'milestone-2',
  },
  {
    id: 'doc-3',
    name: 'Bewijs aanbetaling',
    type: 'pdf',
    status: 'required' as DocumentStatus,
    taskId: 'task-5',
    milestoneId: 'milestone-2',
  },
  {
    id: 'doc-4',
    name: 'Hypotheekofferte',
    type: 'pdf',
    status: 'required' as DocumentStatus,
    taskId: 'task-7',
    milestoneId: 'milestone-3',
  },
  {
    id: 'doc-5',
    name: 'Identiteitsbewijs.jpg',
    type: 'jpg',
    status: 'verified' as DocumentStatus,
    uploadDate: new Date(2025, 3, 5).toISOString(),
    fileUrl: '#',
    taskId: 'task-1',
    milestoneId: 'milestone-1',
  },
  {
    id: 'doc-6',
    name: 'Loonstrook maart 2025.pdf',
    type: 'pdf',
    status: 'verified' as DocumentStatus,
    uploadDate: new Date(2025, 3, 10).toISOString(),
    fileUrl: '#',
    taskId: 'task-2',
    milestoneId: 'milestone-1',
  },
];
