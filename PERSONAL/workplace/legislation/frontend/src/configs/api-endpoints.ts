import { ApiEndpointInterface } from './interfaces';
import { EXTERNAL_LOGIN_URL } from './constants';

export const EXTERNAL_SSO_LOGIN: ApiEndpointInterface = {
  endpoint: EXTERNAL_LOGIN_URL,
  method: 'POST',
  cache: false,
  // json: true,
  is_footer: false,
  is_login: true,
};

export const GET_USER: ApiEndpointInterface = {
  endpoint: '/profiles/profile/',
  method: 'GET',
  cache: true,
  json: true,
  is_footer: false,
};

export const UPDATE_USER: ApiEndpointInterface = {
  endpoint: '/profiles/profile/',
  method: 'PATCH',
  cache: false,
  json: true,
  url: GET_USER.endpoint,
  is_footer: false,
};

export const GET_JOB_ROLES: ApiEndpointInterface = {
  endpoint: '/profiles/jobrole/',
  method: 'GET',
  cache: true,
  json: true,
  is_footer: false,
};

export const GET_LEGISLATION_JOB_ROLE: ApiEndpointInterface = {
  endpoint: '/navigator/legislation/',
  method: 'GET',
  cache: true,
  json: true,
  is_footer: false,
};

export const GET_LEGISLATIONS: ApiEndpointInterface = {
  endpoint: '/navigator/legislation/',
  method: 'GET',
  cache: true,
  json: true,
  is_footer: false,
};

// use like navigator/legislation/:legislationId/
export const GET_LEGISLATIONS_BY_ID: ApiEndpointInterface = {
  endpoint: '/navigator/legislation/',
  method: 'GET',
  cache: true,
  json: true,
  is_footer: false,
};

// use like: navigator/legislation/:legislationId/
export const UPDATE_LEGISLATION: ApiEndpointInterface = {
  endpoint: '/navigator/legislation/',
  method: 'PATCH',
  cache: false,
  json: true,
  url: GET_LEGISLATIONS.endpoint,
  is_footer: false,
};

export const GET_FILTERS: ApiEndpointInterface = {
  endpoint: '/navigator/legislation/filters/',
  method: 'GET',
  cache: true,
  json: true,
  is_footer: false,
};

export const GET_ROLE_CONTENT: ApiEndpointInterface = {
  endpoint: '/navigator/role-content/select/',
  method: 'POST',
  cache: false,
  json: true,
  is_footer: false,
  url: '/navigator/role-content/select/',
};

export const CREATE_ROLE_CONTENT: ApiEndpointInterface = {
  endpoint: '/navigator/role-content/',
  method: 'POST',
  json: true,
  is_footer: false,
};

export const UPDATE_ROLE_CONTENT: ApiEndpointInterface = {
  endpoint: '/navigator/role-content/',
  method: 'PATCH',
  json: true,
  url: GET_ROLE_CONTENT.endpoint,
  is_footer: false,
};
export const UPDATE_ATTENTION_POINT: ApiEndpointInterface = {
  endpoint: '/navigator/attention-point/',
  method: 'PATCH',
  json: true,
  url: GET_ROLE_CONTENT.endpoint,
  is_footer: false,
};

export const REMOVE_ROLE_CONTENT: ApiEndpointInterface = {
  endpoint: '/navigator/role-content/',
  method: 'DELETE',
  json: true,
  url: GET_LEGISLATIONS.endpoint,
  is_footer: false,
};

export const REMOVE_REQUIREMENT: ApiEndpointInterface = {
  endpoint: '/navigator/<requirement_type>/<requirement_id>/',
  method: 'DELETE',
  json: true,
  url: GET_LEGISLATIONS.endpoint,
  is_footer: false,
}

export const REMOVE_ATTENTION_POINT: ApiEndpointInterface = {
  endpoint: '/navigator/attention-point/',
  method: 'DELETE',
  json: true,
  url: GET_LEGISLATIONS.endpoint,
  is_footer: false,
};

export const GET_FOOTER_DATA: ApiEndpointInterface = {
  endpoint: 'https://footertool.pwc.nl/json/?lang=en',
  method: 'GET',
  cache: true,
  json: true,
  is_footer: true,
}


export const UPLOAD_LEGISLATION_FILE: ApiEndpointInterface = {
  endpoint: '/navigator/legislation/upload-legislation/',
  method: 'POST',
  url: GET_LEGISLATIONS.endpoint,
  is_footer: false,
  json: true,
  isFile: true,
}


export const GET_CLIENT_PROJECTS: ApiEndpointInterface = {
  endpoint: '/client/manage/',
  method: 'GET',
  cache: true,
  is_footer: false,
  json: true,
}

export const GET_CLIENT_PROJECT_DETAILS: ApiEndpointInterface = {
  endpoint: '/client/manage/',
  method: 'GET',
  cache: true,
  is_footer: false,
  json: true,
}

export const CREATE_CLIENT_PROJECT: ApiEndpointInterface = {
  endpoint: '/client/manage/',
  method: 'POST',
  cache: true,
  is_footer: false,
  url: GET_CLIENT_PROJECTS.endpoint,
  json: true,
}

export const UPDATE_CLIENT_PROJECT: ApiEndpointInterface = {
  endpoint: '/client/manage/',
  method: 'PATCH',
  cache: true,
  is_footer: false,
  url: GET_CLIENT_PROJECTS.endpoint,
  json: true,
}

export const REQUEST_CLIENT_LEGISLATION_APPROVAL: ApiEndpointInterface = {
  endpoint: '/client/manage/request-publication/',
  method: 'POST',
  is_footer: false,
  json: true,
}

export const GET_CLIENT_LEGISLATIONS: ApiEndpointInterface = {
  endpoint: '/client/manage/publication-status/',
  method: 'POST',
  is_footer: false,
  json: true,
};

export const UPDATE_CLIENT_LEGISLATION: ApiEndpointInterface = {
  endpoint: '/client/manage/update-client-legislation/',
  method: 'POST',
  is_footer: false,
  json: true,
}


export const SEARCH_PEOPLE: ApiEndpointInterface = {
  endpoint: '/profiles/profile/search-pwc/',
  method: 'POST',
  is_footer: false,
  json: true,
}

export const PROJECT_LOGS: ApiEndpointInterface = {
  endpoint: '/auditing/<project_id>/',
  method: 'GET',
  is_footer: false,
  json: true,
  cache: true,
}

export const LEGISLATION_LOGS: ApiEndpointInterface = {
  endpoint: '/auditing/<legislation_id>/',
  method: 'GET',
  is_footer: false,
  json: true,
  cache: true,
};
