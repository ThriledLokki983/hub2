import { Dispatch } from "react";
import { Filter, JobRole, Legislation, LegislationTab } from "./legislation.interface";

type SortPage = "legislations" | "nav-legislations";
type SortOrder = "asc" | "desc";

interface RoleListItem {
  name: string;
  identifier: string;
}

interface JobRoleData {
  identifier: string;
  note: string;
  job_role_list: RoleListItem[];
}

export interface NavigatorLegislation {
  attention_points: JobRoleData[];
  legislation: Legislation;
}

interface NavigatorLegislationTab {
  label: string;
  entries: NavigatorLegislation[];
  count: number;
}

interface InitialState {
  navLegislations: NavigatorLegislation[];
  filteredNavLegislations: NavigatorLegislation[];
  navTabs: NavigatorLegislationTab[];
  filters: Filter[];
  query: string;
  sortOrder: string;
  isLoading: boolean;
  isFetching: boolean;
}

interface NavigatorStateAction {
  type: string;
  payload?: any;
}

interface NavigatorState {
  state: InitialState;
  stateDispatch: Dispatch<NavigatorStateAction>;
  stateActions: any;
  refetch: () => void;
}

type NavigatorReducer = [
  state: InitialState,
  dispatch: any,
  actions: any,
]

type ActionTypes =
  "INIT_STATE"
  | "SET_QUERY"
  | "SET_FILTER_BY"
  | "SET_SORT_ORDER"
  | "SET_ACTIVE_FILTERS"
  | "INIT_ACTIVE_FILTERS"
  | "UPDATE_LOADING_STATE"
  | "UPDATE_FETCHING_STATE"
  | "SORT_NAV_LEGISLATIONS"
  | "UPDATE_ACTIVE_FILTERS"
  | "SET_NAV_LEGISLATION_TABS"

type Actions = {
  initState: (initialState: InitialState) => NavigatorStateAction;
  setQuery: (query: string) => NavigatorStateAction;
  setFilterBy: (filterValue: string) => NavigatorStateAction;
  setSortOrder: (sortOrder: string) => NavigatorStateAction;
  setActiveFilters: (isActive: boolean, filterOption: any, filterValue: string) => NavigatorStateAction;
  initActiveFilters: (activeFilters: Filter[]) => NavigatorStateAction;
  updateLoadingState: (isLoading: boolean) => NavigatorStateAction;
  updateFetchingState: (isFetching: boolean) => NavigatorStateAction;
  sortNavLegislations: (sortValue: string) => NavigatorStateAction;
  updateActiveFilters: (filterId: string) => NavigatorStateAction;
  setNavLegislationTabs: (tabs: LegislationTab[]) => NavigatorStateAction;
}

type ActionCreator<T extends ActionTypes> = (...args: any[]) => { type: T; payload: any };

type ActionCreators = {
  [K in ActionTypes]: ActionCreator<K>;
};

export type {
  Actions,
  ActionTypes,
  InitialState,
  ActionCreators,
  NavigatorState,
  NavigatorReducer,
  NavigatorStateAction,
}
