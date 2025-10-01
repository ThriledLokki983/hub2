import { ApiEndpointInterface } from './interfaces';

export const GET_USER: ApiEndpointInterface = {
  endpoint: '/users/me',
  method: 'GET',
  cache: true,
  json: true,
};

export const LOGIN: ApiEndpointInterface = {
  endpoint: '/auth/login/',
  method: 'POST',
  cache: false,
  json: true,
};

export const LOGOUT: ApiEndpointInterface = {
  endpoint: '/auth/logout/',
  method: 'POST',
  cache: false,
  json: true,
};

export const SIGN_UP: ApiEndpointInterface = {
  endpoint: '/auth/signup/',
  method: 'POST',
  cache: false,
  json: true,
};

export const REQUEST_PASSWORD_RESET: ApiEndpointInterface = {
  endpoint: '/auth/password-reset/request/',
  method: 'POST',
  cache: false,
  json: true,
};

export const CONFIRM_PASSWORD_RESET: ApiEndpointInterface = {
  endpoint: '/auth/password-reset/confirm/',
  method: 'POST',
  cache: false,
  json: true,
};

// User profile endpoints
export const UPDATE_USER_PROFILE: ApiEndpointInterface = {
  endpoint: '/users/profile',
  method: 'PATCH',
  cache: false,
  json: true,
};

// User settings endpoints
export const UPDATE_USER_SETTINGS: ApiEndpointInterface = {
  endpoint: '/users/settings',
  method: 'PATCH',
  cache: false,
  json: true,
};

export const UPDATE_USER_PASSWORD: ApiEndpointInterface = {
  endpoint: '/users/password',
  method: 'PATCH',
  cache: false,
  json: true,
};

// Onboarding endpoints
export const GET_USER_ONBOARDING: ApiEndpointInterface = {
  endpoint: '/user/onboarding',
  method: 'GET',
  cache: false,
  json: true,
};

export const POST_USER_ONBOARDING: ApiEndpointInterface = {
  endpoint: '/user/onboarding',
  method: 'POST',
  cache: false,
  json: true,
};

// User profile photo endpoints
export const UPLOAD_USER_PHOTO: ApiEndpointInterface = {
  endpoint: '/users/:id/photo',
  method: 'POST',
  cache: false,
  json: false, // Set to false since we'll be uploading a file
  formData: true, // Indicate that we're using FormData
};

export const UPDATE_USER_PHOTO: ApiEndpointInterface = {
  endpoint: '/users/:id/photo',
  method: 'PUT',
  cache: false,
  json: false,
  formData: true,
};

export const DELETE_USER_PHOTO: ApiEndpointInterface = {
  endpoint: '/users/:id/photo',
  method: 'DELETE',
  cache: false,
  json: true,
};

// Properties endpoints
export const GET_USER_PROPERTIES: ApiEndpointInterface = {
  endpoint: '/properties/user',
  method: 'GET',
  cache: true,
  json: true,
};

export const CREATE_PROPERTY: ApiEndpointInterface = {
  endpoint: '/properties',
  method: 'POST',
  cache: false,
  json: true,
};

export const UPDATE_PROPERTY: ApiEndpointInterface = {
  endpoint: '/properties',
  method: 'PATCH',
  cache: false,
  json: true,
};

export const DELETE_PROPERTY: ApiEndpointInterface = {
  endpoint: '/properties',
  method: 'DELETE',
  cache: false,
  json: true,
};

// Timeline endpoints
export const GET_USER_TIMELINE: ApiEndpointInterface = {
  endpoint: '/timeline',
  method: 'GET',
  cache: true,
  json: true,
};

export const UPDATE_TIMELINE_STEP: ApiEndpointInterface = {
  endpoint: '/timeline/update',
  method: 'PATCH',
  cache: false,
  json: true,
};
