import { ApiEndpointInterface } from './interfaces';

export const GET_USER: ApiEndpointInterface = {
  endpoint: '/auth/user/',
  method: 'GET',
  cache: true,
  json: true,
};

export const GET_RECIPES: ApiEndpointInterface = {
  endpoint: '/recipes',
  method: 'GET',
  cache: true,
  json: true,
};
