import { Dispatch } from "react";
import { Filter, Legislation } from "./legislation.interface";

export type ProjectLegislation = Legislation & {
  is_filtering: boolean;
  view_type: "details" | "edit";
  isPublishedForClient: boolean;
};

export interface Project {
  associated_legislations: Legislation[];
  client_member_list: Client[];
  created_at: string;
  description: string;
  domain: string;
  logo: string;
  identifier: string;
  is_published: boolean;
  legislation_count: number;
  name: string;
  team_member_list: Client[];
  project_owner_list: Client[];
  starting_date: string;
  updated_at: string;
}

export interface GroupProject {
  label: string;
  projects: Project[];
}

export interface Client {
  identifier: string;
  client_external_member: [];
  client_team_member: [];
  email: string;
  first_name: string;
  groups: string[];
  initials: string;
  is_onboarded: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  job_roles: { identifier: string; name: string; }[];
  last_name: string;
  role: string;
  user_permissions: string[];
  username: string;
}

export interface ConfigLegislation {
  approval_date: string;
  created_at: string;
  is_approved: boolean;
  legislation: Legislation;
}

export interface ProjectLegislationTabs {
  label: string;
  entries: ConfigLegislation[];
  count: number;
}

export interface ConfigLegislation {
  approval_date: string;
  created_at: string;
  is_published: boolean;
  legislation: Legislation;
  is_selecting: boolean;
}

export interface SelectedAttributes {
  [key: string]: { label: string, data: any[] },
  type: { label: string, data: any[] },
  topic: { label: string, data: any[] },
  issuing_jurisdiction: { label: string, data: any[] },
  geographical_scope: { label: string, data: any[] },
  job_role_list: { label: string, data: any[] },
  product_service: { label: string, data: any[] },
}

export interface InitialState {
  project: Project;
  filters: Filter[],
  legislations: Legislation[];
  filteredLegislations: Legislation[];
  activeFilters: Filter[];
  projectGroups: GroupProject[];
  clientLegislations: ConfigLegislation[];
  viewState: "viewing" | "editing";
  selectedAttributes: SelectedAttributes;
  projectLegislationTabs: ProjectLegislationTabs[];
}

export interface ProjectStateAction {
  type: string;
  payload: any;
}

export interface ProjectState {
  state: InitialState;
  dispatch: Dispatch<ProjectStateAction>;
  stateActions: any;
  isLoading: boolean;
  isPending: boolean;
  isClientDataPending: boolean;
  isUpdatePending: boolean;
  isApprovalPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  canPublishProject: boolean;
  canSendForApproval: boolean;
  updateProjectDetails: (data: any) => void;
  requestProjectLegislationApproval: (payload: any) => void;
  updateFilters: (checked: boolean, filterOption: Filter, name: string) => void;
}

export type ProjectReducer = [
  state: InitialState,
  dispatch: Dispatch<ProjectStateAction>,
  actions: Actions,
]

export type ActionTypes =
  "INIT_STATE"
  | "SET_PROJECT_TABS"
  | "SET_QUERY"
  | "SET_SORT_ORDER"
  | "SET_PROJECT_GROUPS"
  | "SET_CLIENT_LEGISLATIONS"
  | "SET_FILTERS"
  | "SET_LEGISLATIONS"
  | "SET_VIEW_STATE"


export enum EnumActionTypes {
  INIT_STATE = "INIT_STATE",
  SET_PROJECT_TABS = "SET_PROJECT_TABS",
  SET_QUERY = "SET_QUERY",
  SET_SORT_ORDER = "SET_SORT_ORDER",
  SET_PROJECT_GROUPS = "SET_PROJECT_GROUPS",
  SET_CLIENT_LEGISLATIONS = "SET_CLIENT_LEGISLATIONS",
  SET_FILTERS = "SET_FILTERS",
  SET_LEGISLATIONS = "SET_LEGISLATIONS",
  SET_VIEW_STATE = "SET_VIEW_STATE",
}

export type Actions = {
  initState: (initState: InitialState) => ProjectStateAction;
  setProjectTabs: (projectTabs: ProjectLegislationTabs[]) => ProjectStateAction;
  setQuery: (query: string) => ProjectStateAction;
  setSortOrder: (sortOrder: string) => ProjectStateAction;
  setProjectGroups: (projectGroups: GroupProject[]) => ProjectStateAction;
  setClientLegislations: (clientLegislations: ConfigLegislation[]) => ProjectStateAction;
  setFilters: (filters: Filter[]) => ProjectStateAction;
  setLegislations: (legislations: Legislation[]) => ProjectStateAction;
  setViewState: (viewState: "viewing" | "editing") => ProjectStateAction;
}

type ActionCreator<T extends ActionTypes> = (...args: any[]) => { type: T; payload: any };

export type ActionCreators = {
  [K in ActionTypes]: ActionCreator<K>;
}
