import { Reducer, useReducer, useMemo } from 'react';

import {
  Actions,
  Project,
  ActionTypes,
  InitialState,
  ActionCreators,
  ProjectReducer,
  EnumActionTypes,
  ProjectStateAction,
  ProjectLegislationTabs,
  GroupProject,
  ConfigLegislation,
} from '../interfaces/project.interface';

const UseProjectReducer = (initialState: InitialState): ProjectReducer => {
  const [state, dispatch] = useReducer<Reducer<InitialState, ProjectStateAction>>(projectStateReducerFunction, initialState || {}, undefined);

  const actionCreators: ActionCreators = useMemo(() => ({
    INIT_STATE: (initState: InitialState) => ({
      type: "INIT_STATE",
      payload: { initState }
    }),
    SET_PROJECT_TABS: (projectTabs: ProjectLegislationTabs[]) => ({
      type: "SET_PROJECT_TABS",
      payload: { projectTabs }
    }),
    SET_QUERY: (query: string) => ({
      type: "SET_QUERY",
      payload: { query }
    }),
    SET_SORT_ORDER: (sortOrder: string) => ({
      type: "SET_SORT_ORDER",
      payload: { sortOrder }
    }),
    SET_PROJECT_GROUPS: (projectGroups: GroupProject[]) => ({
      type: "SET_PROJECT_GROUPS",
      payload: { projectGroups }
    }),
    SET_CLIENT_LEGISLATIONS: (clientLegislations: ConfigLegislation[]) => ({
      type: "SET_CLIENT_LEGISLATIONS",
      payload: { clientLegislations }
    }),
    SET_FILTERS: (filters: any) => ({
      type: "SET_FILTERS",
      payload: { filters }
    }),
    SET_LEGISLATIONS: (legislations: any) => ({
      type: "SET_LEGISLATIONS",
      payload: { legislations }
    }),
    SET_VIEW_STATE: (viewState: "viewing" | "editing") => ({
      type: "SET_VIEW_STATE",
      payload: { viewState }
    }),
  }), []);

  const actions: Actions = useMemo(() => ({
    initState: actionCreators["INIT_STATE"],
    setProjectTabs: actionCreators["SET_PROJECT_TABS"],
    setQuery: actionCreators["SET_QUERY"],
    setSortOrder: actionCreators["SET_SORT_ORDER"],
    setProjectGroups: actionCreators["SET_PROJECT_GROUPS"],
    setClientLegislations: actionCreators["SET_CLIENT_LEGISLATIONS"],
    setFilters: actionCreators["SET_FILTERS"],
    setLegislations: actionCreators["SET_LEGISLATIONS"],
    setViewState: actionCreators["SET_VIEW_STATE"],
  }), [actionCreators]);

  return [state, dispatch, actions];
};

const projectReducer: Record<ActionTypes, ProjectStateActionHandler> = {
  // INITIAL STATE
  [EnumActionTypes.INIT_STATE]: (state: InitialState, action: ProjectStateAction) => {
    const { payload: { initState } } = action;

    return { ...state, project: initState };
  },

  // SET PROJECT TABS
  [EnumActionTypes.SET_PROJECT_TABS]: (state: InitialState, action: ProjectStateAction) => {
    const { payload: { projectTabs } } = action;

    return { ...state, projectLegislationTabs: projectTabs };
  },

  // SET QUERY
  [EnumActionTypes.SET_QUERY]: (state: InitialState, action: ProjectStateAction) => {
    const { payload: { query } } = action;

    return { ...state, query };
  },

  // SET SORT ORDER
  [EnumActionTypes.SET_SORT_ORDER]: (state: InitialState, action: ProjectStateAction) => {
    const { payload: { sortOrder } } = action;

    return { ...state, sortOrder };
  },

  // SET PROJECT GROUPS
  [EnumActionTypes.SET_PROJECT_GROUPS]: (state: InitialState, action: ProjectStateAction) => {
    const { payload: { projectGroups } } = action;

    return { ...state, projectGroups };
  },
  [EnumActionTypes.SET_CLIENT_LEGISLATIONS]: (state: InitialState, action: ProjectStateAction) => {
    const { payload: { clientLegislations } } = action;

    return { ...state, clientLegislations };
  },
  [EnumActionTypes.SET_FILTERS]: (state: InitialState, action: ProjectStateAction) => {
    const { payload: { filters } } = action;

    return { ...state, filters };
  },
  [EnumActionTypes.SET_LEGISLATIONS]: (state: InitialState, action: ProjectStateAction) => {
    const { payload: { legislations } } = action;

    return { ...state, legislations };
  },
  [EnumActionTypes.SET_VIEW_STATE]: (state: InitialState, action: ProjectStateAction) => {
    const { payload: { viewState } } = action;

    return { ...state, viewState };
  },
};

const projectStateReducerFunction: Reducer<InitialState, ProjectStateAction> = (state, action) =>
  projectReducer[action["type"] as ActionTypes](state, action);

interface ProjectStateActionHandler {
  (state: InitialState, action: ProjectStateAction): InitialState;
}

export default UseProjectReducer;
