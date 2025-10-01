/**
 * Note: don't add trailing slashes to route paths, since `path.isActive`
 * highlighting won't work correctly for child paths when using `NavLink`.
 */
export const PATH_HOME: string = '/';
export const PATH_PATTERNS: string = '/patterns';
export const PATH_LOGOUT: string = '/auth/logout';
export const PATH_NOT_FOUND: string = '404';

// Authentication paths
export const PATH_AUTH: string = '/auth';
export const PATH_LOGIN: string = '/auth/login';
export const PATH_SIGNUP: string = '/auth/signup';
export const PATH_RESET_PASSWORD: string = '/auth/reset-password';

// User account paths
export const PATH_PROFILE: string = '/profile';
export const PATH_SETTINGS: string = '/settings';
export const PATH_MY_PROPERTIES: string = '/properties';
export const PATH_TIMELINE: string = '/timeline';
export const PATH_ENHANCED_TIMELINE: string = '/timeline/enhanced';
export const PATH_JOURNEY_DASHBOARD: string = '/journey';
export const PATH_FINANCIAL_DASHBOARD: string = '/financial-dashboard';

// Legal paths
export const PATH_LEGAL: string = '/legal';
export const PATH_PRIVACY_POLICY: string = '/legal/privacy-policy';
export const PATH_TERMS_OF_SERVICE: string = '/legal/terms-of-service';
export const PATH_COOKIE_POLICY: string = '/legal/cookie-policy';

// Company pages
export const PATH_COMPANY: string = '/company';
export const PATH_COMPANY_ABOUT: string = '/company/about';
export const PATH_COMPANY_CONTACT: string = '/company/contact';
export const PATH_COMPANY_CAREERS: string = '/company/careers';
export const PATH_COMPANY_BLOG: string = '/company/blog';
