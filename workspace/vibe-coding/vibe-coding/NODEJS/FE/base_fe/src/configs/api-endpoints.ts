import { ApiEndpointInterface } from './interfaces';


export const GET_USER: ApiEndpointInterface = {
  endpoint: '/auth/user/',
  method: 'GET',
  cache: true,
  json: true,
};
