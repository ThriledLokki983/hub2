interface ApiEndpointInterface {
  endpoint: string;
  method: string;
  cache?: boolean;
  json?: boolean;
  throwError?: boolean;
  formData?: boolean; // Added for file uploads
  multipart?: boolean; // Added for multipart/form-data
  cacheControl?: string; // HTTP cache control header value
}

export type { ApiEndpointInterface };
