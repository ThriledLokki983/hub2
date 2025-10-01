/**
 * Note: don't add trailing slashes to route paths, since `path.isActive`
 * highlighting won't work correctly for child paths when using `NavLink`.
 */
export const PATH_HOME: string = '/';
export const PATH_PATTERNS: string = '/patterns';
export const PATH_LOGOUT: string = '/logout';
export const PATH_LOGIN_FAIL: string = '/login-fail'
export const PATH_SETTINGS: string = '/settings';
export const PATH_SERVER_ERROR: string = '/server';
export const PATH_NOT_FOUND: string = '*' as const;
export const PATH_ACCESS: string = '/access';

// Main Pages
export const PATH_ADMIN: string = '/admin';

// Navigator
export const PATH_NAVIGATOR: string = '/navigator';
export const PATH_NAVIGATOR_LANDING: string = '/navigator/landing';
export const PATH_ROLE_BASED_NAVIGATOR: string = '/navigator/role-based';

// Legislation
export const PATH_LEGISLATION: string = '/legislation';
export const PATH_LEGISLATION_ALL: string = 'all';
export const PATH_LEGISLATION_DETAILS: string = 'all/:legislationId/:tabIndex';
export const PATH_LEGISLATION_EDIT: string = 'edit/:legislationId';
export const PATH_LEGISLATION_LOGS: string = ':legislationId/logs';

// Projects
export const PATH_PROJECTS: string = '/projects';
export const PATH_PROJECTS_ALL: string = 'all';
export const PATH_PROJECT_DETAILS: string = ':projectId/details/:tabIndex';
export const PATH_PROJECT_EDIT: string = ':projectId/edit/:tabIndex';
export const PATH_PROJECT_LOGS: string = ':projectId/logs';
