import { ApiEndpointInterface } from './interfaces';

export const INIT_JOURNEY: ApiEndpointInterface = {
  endpoint: '/journey/init',
  method: 'POST',
  cache: false,
  json: true,
};

export const GET_JOURNEY_TIMELINE: ApiEndpointInterface = {
  endpoint: '/journey/timeline',
  method: 'GET',
  cache: true,
  json: true,
  cacheControl: 'max-age=300', // Cache for 5 minutes
};

export const GET_JOURNEY_TASKS: ApiEndpointInterface = {
  endpoint: '/journey/tasks',
  method: 'GET',
  cache: true,
  json: true,
  cacheControl: 'max-age=300', // Cache for 5 minutes
};

export const COMPLETE_JOURNEY_TASK: (taskId: string) => ApiEndpointInterface = (
  taskId: string,
) => ({
  endpoint: `/journey/tasks/${taskId}/complete`,
  method: 'POST',
  cache: false,
  json: false, // No JSON payload needed
  formData: false,
});

export const GET_FINANCIAL_SUMMARY: ApiEndpointInterface = {
  endpoint: '/journey/finance/summary',
  method: 'GET',
  cache: true,
  json: true,
  cacheControl: 'max-age=300', // Cache for 5 minutes
};

export const UPDATE_FINANCIAL_SUMMARY: ApiEndpointInterface = {
  endpoint: '/journey/finance/summary',
  method: 'POST',
  cache: false,
  json: true,
};

export const UPLOAD_DOCUMENT: ApiEndpointInterface = {
  endpoint: '/journey/documents/upload',
  method: 'POST',
  cache: false,
  json: false, // Set to false since we're sending multipart/form-data
  formData: true, // For file uploads
  multipart: true, // Indicates this is a multipart/form-data request
  // Expected payload shape:
  // {
  //   file: File, // Binary file content
  //   type: string // Document type identifier
  // }
};

export const GET_DOCUMENTS: ApiEndpointInterface = {
  endpoint: '/journey/documents',
  method: 'GET',
  cache: true,
  json: true,
};

// Enhanced Timeline Endpoints
export const JOURNEY_TIMELINE_ENHANCED: ApiEndpointInterface = {
  endpoint: '/journey/timeline/enhanced',
  method: 'GET',
  cache: true,
  json: true,
  cacheControl: 'max-age=300', // Cache for 5 minutes
};

export const UPDATE_TIMELINE_STEP_ENHANCED: ApiEndpointInterface = {
  endpoint: '/journey/timeline/step',
  method: 'PATCH',
  cache: false,
  json: true,
};
