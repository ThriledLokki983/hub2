import { Dispatch } from "react";

interface RoleData {
  identifier: string;
  name: string;
}

interface Role {
  identifier: string;
  name: string;
}

export type FilterOption = {
  id: number;
  created_at: string;
  updated_at: string;
  identifier: string;
  name: string;
  is_approved: boolean;
} & { label?: string; }

export interface Filter {
 name: string;
 label: string;
 data: FilterOption[];
}

export interface Contact {
  id: number;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface Category {
  product_service: string[];
  geographical_scope: string[];
  topic: string[];
  type: string[];
  issuing_jurisdiction: string[];
  effective_year: string[];
  status: string[];
  job_role_list: string[];
}

interface FilterData {
  label: string;
  identifier: string;
  name: string;
}

export interface Requirement {
  id: number;
  identifier: string;
  created_at: string;
  updated_at: string;
  description: string;
  responsible_authority: string;
  trigger: string;
  responsible_party: string;
  data_elements: string;
  payment_obligations: string;
  key_actions: string;
  deadline: string;
  threshold: string;
  sanctions: string;
  exemptions: string;
}
interface Legislation {
  id: number;
  identifier: string;
  created_at: string;
  updated_at: string;
  name_local: string;
  name_generic: string;
  abbreviation: string;
  effective_until: string;
  link: string;
  is_in_effect: boolean;
  responsible_authority: string;
  non_compliance_risk: string;
  background: string;
  responsible_party: string;
  summary: string;
  scope: string;
  preparation_state: string;
  review_cadence_months: number;
  created_by: number;
  pwc_contact: Contact[];
  pwc_territory: string;
  role_filters?: NavigatorLegislation[];
  attention_point_list: NavigatorJobRole[];

  additional_links: string;
  region?: string;
  responsible_party_summary?: string;
  objective: string;
  scope_summary?: string;

  status: string;
  effective_date: string;

  // Filters
  type: Filter[];
  topic: Filter[];
  job_role_list: Filter[];
  product_service: Filter[];
  geographical_scope: Filter[];
  issuing_jurisdiction: Filter[];

  // Requirements
  registration_requirements: Requirement[];
  reporting_requirements: Requirement[];
  regulatory_requirements: Requirement[];

  // compliance
  non_compliance_consequence?: RoleData[]
}

export interface LegislationTab {
  label: string;
  entries: Legislation[];
  count: number;
}

/**
 * Job Role related
 */
export interface JobRole {
  identifier: string;
  name: string;
}

interface JobRoleData {
  job_roles: JobRole[];
  note:string;
}

interface RoleListItem {
  name: string;
  identifier: string;
}

export interface NavigatorJobRole {
  identifier: string;
  note: string;
  job_role_list: RoleListItem[];
}


export interface JobRoleResponseData {
  example: string;
  identifier: string;
  job_role: {
    identifier: string;
    name: string;
  };
  what: string;
  why: string;
}

export interface RoleSpecificData {
  identifier: string;
  name: string;
  label: string;
}

export interface NavigatorLegislation {
  attention_points: JobRoleData[];
  legislation: Legislation;
}

type SortPage = "legislations" | "nav-legislations";
type SortOrder = "asc" | "desc";

interface InitialState {
  legislations: Legislation[];
  filteredLegislations: Legislation[];
  legislationTabs: LegislationTab[];
  current: Legislation;
  filters: Filter[];
  query: string;
  sortOrder: string;
  isLoading: boolean;
  isFetching: boolean;
}

interface LegislationStateAction {
  type: string;
  payload?: any;
}

interface LegislationState {
  state: InitialState;
  stateDispatch: Dispatch<LegislationStateAction>;
  stateActions: any;
  refetch: () => void;
  isLoading: boolean;
}

type LegislationReducer = [
  state: InitialState,
  dispatch: Dispatch<LegislationStateAction>,
  actions: any,
]

type ActionTypes =
  "INIT_STATE"
  | "INIT_ACTIVE_FILTERS"
  | "SORT_LEGISLATIONS"
  | "UPDATE_LOADING_STATE"
  | "UPDATE_FETCHING_STATE"
  | "SET_CURRENT"
  | "SET_ACTIVE_FILTERS"
  | "UPDATE_ACTIVE_FILTERS"
  | "SET_QUERY"
  | "SET_SORT_ORDER"
  | "SET_LEGISLATION_TABS"
  | "SET_FILTER_BY";

export enum EnumActionTypes {
  INIT_STATE = "INIT_STATE",
  SORT_LEGISLATIONS = "SORT_LEGISLATIONS",
  INIT_ACTIVE_FILTERS = "INIT_ACTIVE_FILTERS",
  UPDATE_LOADING_STATE = "UPDATE_LOADING_STATE",
  UPDATE_FETCHING_STATE = "UPDATE_FETCHING_STATE",
  SET_CURRENT = "SET_CURRENT",
  SET_ACTIVE_FILTERS = "SET_ACTIVE_FILTERS",
  UPDATE_ACTIVE_FILTERS = "UPDATE_ACTIVE_FILTERS",
  SET_QUERY = "SET_QUERY",
  SET_SORT_ORDER = "SET_SORT_ORDER",
  SET_LEGISLATION_TABS = "SET_LEGISLATION_TABS",
  SET_FILTER_BY = "SET_FILTER_BY",
}
type Actions = {
  initState: (initState: InitialState, userPermission: 'approver' | 'preparer' | 'viewer') => LegislationStateAction;
  initActiveFilters: (filters: Filter[]) => LegislationStateAction;
  sortLegislations: (page: SortPage, sortType: SortOrder) => LegislationStateAction;
  updateLoadingState: (isLoading: boolean) => LegislationStateAction;
  updateFetchingState: (isFetching: boolean) => LegislationStateAction;
  seCurrentLegislation: (current: Legislation) => LegislationStateAction;
  setActiveFilters: (isFilterChecked: boolean, filterOption: any, filterValue: string) => LegislationStateAction;
  updateActiveFilters: (filterId: string) => LegislationStateAction;
  setLegislationTabs: (tabs: LegislationTab[]) => LegislationStateAction;
  setQuery: (query: string) => LegislationStateAction;
  setSortOrder: (sortOrder: string) => LegislationStateAction;
  setFilterBy: (filterValue: string) => LegislationStateAction;
}

type ActionCreator<T extends ActionTypes> = (...args: any[]) => { type: T; payload: any };

type ActionCreators = {
  [K in ActionTypes]: ActionCreator<K>;
};

export type {
  Actions,
  Category,
  FilterData,
  ActionTypes,
  Legislation,
  InitialState,
  ActionCreators,
  LegislationState,
  LegislationReducer,
  LegislationStateAction,
}
