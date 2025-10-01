import { getCookie } from 'react-use-cookie';

export const SITE_TITLE = 'Inclusion Insights';

export const SESSION_ID = 'SESSION_ID';
export const SESSION = getCookie(SESSION_ID);

export const API_URL = import.meta.env.VITE_APP_API_URL;
export const LOGIN_URL = import.meta.env.VITE_APP_LOGIN_URL;
export const LOGOUT_URL = import.meta.env.VITE_APP_LOGOUT_URL;
export const CACHE_LIFE = import.meta.env.VITE_APP_CACHE_LIFE;
