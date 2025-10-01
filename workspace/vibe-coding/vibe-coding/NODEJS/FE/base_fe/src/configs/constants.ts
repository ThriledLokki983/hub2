import { getCookie } from 'react-use-cookie';

import { HttpCodesInterface, CssBreakPointsInterface } from './interfaces';


const DEVELOPMENT: boolean = import.meta.env.DEV;

const SITE_TITLE = '++PROJECT_NAME++';

const CSRF_TOKEN_COOKIE_NAME = 'csrftoken';
const CSRF_TOKEN: string = getCookie(CSRF_TOKEN_COOKIE_NAME);

const HTTP_CODES_UNAUTHORIZED: HttpCodesInterface = [401, 403];

const API_URL: string = import.meta.env.VITE_API_URL;
const LOGIN_URL: string = import.meta.env.VITE_LOGIN_URL;
const LOGOUT_URL: string = import.meta.env.VITE_LOGOUT_URL;

const CSS_BREAKPOINTS: CssBreakPointsInterface = [
  'tiny',
  'small',
  'medium',
  'large',
  'huge',
];


export {
  API_URL,
  CSRF_TOKEN_COOKIE_NAME,
  CSRF_TOKEN,
  CSS_BREAKPOINTS,
  DEVELOPMENT,
  HTTP_CODES_UNAUTHORIZED,
  LOGIN_URL,
  LOGOUT_URL,
  SITE_TITLE,
}
