import { getCookie } from 'react-use-cookie';

import { HttpCodesInterface, CssBreakPointsInterface } from './interfaces';
import CompassIcon from 'assets/icons/compass-outline.svg?react';
import NoteIcon from 'assets/icons/document-outline.svg?react';
import DefaultIcon from 'assets/icons/art-themes-outline.svg?react';
import ProjectsIcon from 'assets/icons/folder-opened-outline.svg?react';

export const ICONS = {
  "Navigator": CompassIcon,
  "Legislation": NoteIcon,
  "Projects": ProjectsIcon,
  "Default": DefaultIcon,
}

const DEVELOPMENT: boolean = import.meta.env.DEV;

const SITE_TITLE = 'Sustainability Legislation Navigator';
export const CURRENT_TOUR_STEP_ID = 'sln-current-tour-step';

const CSRF_TOKEN_COOKIE_NAME = 'csrftoken';
const CSRF_TOKEN: string = getCookie(CSRF_TOKEN_COOKIE_NAME);

const HTTP_CODES_UNAUTHORIZED: HttpCodesInterface = [401, 403];

const API_URL: string = import.meta.env.VITE_API_URL;
const LOGIN_URL: string = import.meta.env.VITE_LOGIN_URL;
const EXTERNAL_LOGIN_URL: string = import.meta.env.VITE_MSAL_LOGIN_URL;
const LOGOUT_URL: string = import.meta.env.VITE_LOGOUT_URL;

// Pendo stuff
const FRONTEND_DEV = 'gideon.nimoh@pwc.com';
export const PENDO_API_KEY = import.meta.env.VITE_PENDO_API_KEY;
export const PENDO_ACCOUNT_ID = import.meta.env.VITE_PENDO_ACCOUNT_ID;
export const ALLOW_TEMPLATE_DOWNLOAD = import.meta.env.VITE_ALLOW_TEMPLATE_DOWNLOAD;
export const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
export const ALLOW_PROJECTS_PAGE = import.meta.env.VITE_ALLOW_PROJECTS_PAGE === 'true';
export const ALLOWED_LOCAL_ADMIN = import.meta.env.VITE_ALLOWED_LOCAL_ADMIN || FRONTEND_DEV;
export const PENDO_ALLOWED_HOSTNAMES = ['sustainabilitylegislationnavigator.pwc.com'];

const CSS_BREAKPOINTS: CssBreakPointsInterface = [
  'tiny',
  'small',
  'medium',
  'large',
  'huge',
];

export const PREPARER_ADMIN_PERMISSION = 'Preparer';
export const APPROVER_ADMIN_PERMISSION = 'Approver';
export const FILE_UPLOADER_ADMIN_PERMISSION = 'File uploader';
export const INVALID_SELECTION = 'Select';
export const ADMIN_PERMISSIONS = [
  'Select Permission',
  PREPARER_ADMIN_PERMISSION,
  APPROVER_ADMIN_PERMISSION,
  FILE_UPLOADER_ADMIN_PERMISSION,
]

export const KEY_VALUES = {
  // Navigation Keys
  LEFT: 'ArrowLeft',
  UP: 'ArrowUp',
  RIGHT: 'ArrowRight',
  DOWN: 'ArrowDown',
  END: 'End',
  HOME: 'Home',
  PAGE_DOWN: 'PageDown',
  PAGE_UP: 'PageUp',

  // Whitespace Keys
  ENTER: 'Enter',
  TAB: 'Tab',
  SPACE: ' ',

  // Editing Keys
  BACKSPACE: 'Backspace',
  DELETE: 'Delete',
  COMMA: ',',

  // UI Keys
  ESC: 'Escape',
  SHIFT: 'Shift'
};

const FILTER_ICONS = {
  "Product": 'BoxOpenIcon',
  "Statuses": 'StatusIcon',
  "Effective": 'CalendarIcon',
  "Legislation": 'CheckmarkIcon',
  "Topic": 'TalentIcon',
  "Issuing": 'HubIcon',
  "Geographical": 'GlobeIcon',
  "Job": 'PersonIcon',
  "Status": 'DialMedium'
};
export type IconName = keyof typeof FILTER_ICONS;

/**
 * Keyboard key mappings
 */
export const KEYS = {
  Backspace: 'Backspace',
  Clear: 'Clear',
  Down: 'ArrowDown',
  End: 'End',
  Enter: 'Enter',
  Escape: 'Escape',
  Home: 'Home',
  Left: 'ArrowLeft',
  PageDown: 'PageDown',
  PageUp: 'PageUp',
  Right: 'ArrowRight',
  Space: ' ',
  Tab: 'Tab',
  Up: 'ArrowUp'
};

/**
 * Menu Actions
 */
export const MENU_ACTIONS = {
  Close: 0,
  CloseSelect: 1,
  First: 2,
  Last: 3,
  Next: 4,
  Open: 5,
  Previous: 6,
  Select: 7,
  Space: 8,
  Type: 9
};


export {
  API_URL,
  CSRF_TOKEN_COOKIE_NAME,
  CSRF_TOKEN,
  CSS_BREAKPOINTS,
  DEVELOPMENT,
  HTTP_CODES_UNAUTHORIZED,
  LOGIN_URL,
  EXTERNAL_LOGIN_URL,
  LOGOUT_URL,
  SITE_TITLE,
  FILTER_ICONS,
}
