import { Filter, Legislation } from "hooks/interfaces/legislation.interface";
import { SelectedAttributes } from "pages/ProjectEdit/Tabs/interfaces";

export const PROJECT_CREATE_TABS = [
  { label: 'Client Details', isError: false },
  { label: 'Engagement lead & manager(s)', isError: false },
];
export const PROJECTS_CREATE_MODAL = 'project-create-modal-1';
export const PROJECT_CREATE_FORM_ID = 'project-create-form-1';
export const PROJECT_EDIT_FORM_ID = 'project-edit-form-1';
export const LEGISLATION_DETAILS_ROLE_CONTENT_MODAL_ID = 'legislation_details_role_content_client-1';

export type ActionLabels = {
  CREATED: string;
  PUBLISHED: string;
  IN_REVIEW: string;
};

export const ACTION_LABELS: ActionLabels = {
  CREATED: 'Edit',
  PUBLISHED: 'See Details',
  IN_REVIEW: 'Review',
}


export const PROJECT_DETAILS_TABLIST =  [
  { identifier: 'role_specific_details', label: 'Client details', description: 'Client details' },
  // { identifier: 'engagement_lead_mgrs', label: 'Engagement lead & manager(s)', description: 'Engagement lead & manager(s)' },
  { identifier: 'legislation_details', label: 'Admin Setup', description: 'Admin Setup' },
  { identifier: 'expert_contacts', label: 'Content Configuration', description: 'Content Configuration' },
];

export const PROJECT_EDIT_TAB_TITLE: { [key: number]: string } = {
  '1': 'Enter the general details of the client project and specify the client email domain for inviting users from the client side.',
  '2': 'Invite PwC admin users to this project. They will be able to modify and review legislations. Do you want to invite a new admin user that does not have access to the app? By default, new users will be assigned the role of "Preparer". To grant users any "Approver" rights (country or legislation based), please contact the Application Administrator.',
  '3': 'Select the attributes that match the client project objectives to find all the legislations that are relevant to your client or add a new legislation. After selecting the legislations, they will have to go through the admin review project, before being ready to publish.',
}

export const PROJECT_DETAILS_TAB_TITLE: { [key: number]: string } = {
  '1': 'General details of the client project and the client email domain for inviting users from the client side..',
  '2': 'PwC admins get access to the project environment. Admins can modify and publish content to the environment based on their permission rights.',
  '3': 'View the legislation pieces that match the attributes based on the client\'s needs and objectives.',
  '4': 'Preview the client environment from the client\'s perspective.'
}

export const EMPTY_FILTERS: Filter[] = [
  { name: 'Type', label: 'type', data: [] },
  { name: 'Topic', label: 'topic', data: [] },
  { name: 'Issuing Jurisdiction', label: 'issuing_jurisdiction', data: [] },
  { name: 'Geographical Scope', label: 'geographical_scope', data: [] },
  { name: 'Job Roles', label: 'job_roles', data: [] },
  { name: 'Product/Service', label: 'product_service', data: [] },
];

export const EMPTY_ATTRIBUTES: SelectedAttributes = {
  type: { label: 'Type', data: [] },
  topic: { label: 'Topic', data: [] },
  issuing_jurisdiction: { label: 'Issuing Jurisdiction', data: [] },
  geographical_scope: { label: 'Geographical Scope', data: [] },
  job_role_list: { label: 'Job Roles', data: [] },
  product_service: { label: 'Product/Service', data: [] },
}

export const STATE_DEFAULTS = {
  project: {
    associated_legislations: [],
    client_member_list: [],
    created_at: "",
    description: "",
    domain: "",
    logo: "",
    identifier: "",
    is_published: false,
    legislation_count: 0,
    name: "",
    team_member_list: [],
    project_owner_list: [],
    starting_date: "",
    updated_at: "",
  },
  filters: [],
  legislations: [],
  filteredLegislations: [],
  clientLegislations: [],
  projectLegislationTabs: [],
  projectGroups: [],
  activeFilters: [],
  selectedAttributes: EMPTY_ATTRIBUTES,
  viewState: 'viewing' as 'viewing' | 'editing',
}
