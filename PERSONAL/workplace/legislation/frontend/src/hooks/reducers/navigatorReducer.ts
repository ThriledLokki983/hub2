import { Reducer, useReducer, useMemo } from 'react';
import { store, restore, isMatchedSearched }  from 'helpers/utils';
import {
  Actions,
  ActionTypes,
  InitialState,
  ActionCreators,
  NavigatorReducer,
  NavigatorStateAction,
} from 'hooks/interfaces/navigator.interface';
import { ACTIVE_LEGISLATION_FILTERS_ID } from 'configs/legislation/legislation';
import { Filter, FilterOption } from 'hooks/interfaces/legislation.interface';
import {
  sortNavigatorLegislationByFilterKey,
  sortNavigatorLegislationData,
  updateFilterOptionsById, updateFilters, updateOption,
} from './helpers';
interface NavigatorStateActionHandler {
  (state: InitialState, action: NavigatorStateAction): InitialState;
}

/**
 *
 * @param initialState
 * @returns
 */
const useNavigatorReducer = (initialState: InitialState): NavigatorReducer => {
  const [state, dispatch] = useReducer<Reducer<InitialState, NavigatorStateAction>>(navigatorStateReducerFunction, initialState || {}, undefined);

  const actionCreators: ActionCreators = useMemo(() => ({
    INIT_STATE: (initialState: InitialState) => ({
      type: 'INIT_STATE',
      payload: { initialState },
    }),
    SET_QUERY: (query: string) => ({
      type: 'SET_QUERY',
      payload: { query },
    }),
    SET_FILTER_BY: (filterValue: string) => ({
      type: 'SET_FILTER_BY',
      payload: { filterValue },
    }),
    SET_SORT_ORDER: (sortOrder: string) => ({
      type: 'SET_SORT_ORDER',
      payload: { sortOrder },
    }),
    SET_ACTIVE_FILTERS: (isFilterChecked: boolean, filterOption: any, filterValue: string) => ({
      type: 'SET_ACTIVE_FILTERS',
      payload: { isFilterChecked, filterOption, filterValue },
    }),
    INIT_ACTIVE_FILTERS: (filters: string[]) => ({
      type: 'INIT_ACTIVE_FILTERS',
      payload: { filters },
    }),
    UPDATE_LOADING_STATE: (isLoading: boolean) => ({
      type: 'UPDATE_LOADING_STATE',
      payload: { isLoading },
    }),
    UPDATE_FETCHING_STATE: (isFetching: boolean) => ({
      type: 'UPDATE_FETCHING_STATE',
      payload: { isFetching },
    }),
    SORT_NAV_LEGISLATIONS: (sortValue: string) => ({
      type: 'SORT_NAV_LEGISLATIONS',
      payload: { sortValue },
    }),
    UPDATE_ACTIVE_FILTERS: (filterId: string) => ({
      type: 'UPDATE_ACTIVE_FILTERS',
      payload: { filterId },
    }),
    SET_NAV_LEGISLATION_TABS: (tabs: string[]) => ({
      type: 'SET_NAV_LEGISLATION_TABS',
      payload: { tabs },
    }),
  }), []);

  const actions: Actions = useMemo(() => ({
    initState: actionCreators["INIT_STATE"],
    setQuery: actionCreators["SET_QUERY"],
    setFilterBy: actionCreators["SET_FILTER_BY"],
    setSortOrder: actionCreators["SET_SORT_ORDER"],
    setActiveFilters: actionCreators["SET_ACTIVE_FILTERS"],
    initActiveFilters: actionCreators["INIT_ACTIVE_FILTERS"],
    updateLoadingState: actionCreators["UPDATE_LOADING_STATE"],
    updateFetchingState: actionCreators["UPDATE_FETCHING_STATE"],
    sortNavLegislations: actionCreators["SORT_NAV_LEGISLATIONS"],
    updateActiveFilters: actionCreators["UPDATE_ACTIVE_FILTERS"],
    setNavLegislationTabs: actionCreators["SET_NAV_LEGISLATION_TABS"],
  }), [actionCreators]);

  return [state, dispatch, actions];
};

//-------------------------------------------------------------------
/**
 * Navigator Reducer
 */
const navigatorReducer: Record<ActionTypes, NavigatorStateActionHandler> = {

  // INITIAL STATE
  INIT_STATE: (state: InitialState, action: NavigatorStateAction) => {
    const { initialState } = action.payload;
    return { ...state, ...initialState };
  },
  INIT_ACTIVE_FILTERS: (state: InitialState, action: NavigatorStateAction) => {
    const { filters } = action.payload;
    return { ...state, filters };
  },

  // FILTERS
  SET_ACTIVE_FILTERS: (state: InitialState, action: NavigatorStateAction) => {
    const activeFiltersData = restore(ACTIVE_LEGISLATION_FILTERS_ID, { permanent: false });
    const { payload: { isFilterChecked, filterOption, filterValue } } = action;

    const filters = activeFiltersData || state.filters;
    const existingFilter = filters.find((filter: Filter) => filter.name === filterOption.name);

    // Main logic for updating the active filters
    const finalFilters = existingFilter
    ? updateFilters(filters, filterOption, filterValue, isFilterChecked)
    : [
      ...filters,
      {
        ...filterOption,
        data: filterOption
        .data
        .map((filterOption: FilterOption) => updateOption(filterOption, filterValue, isFilterChecked)),
      }
    ];

    store(ACTIVE_LEGISLATION_FILTERS_ID, finalFilters, { permanent: false });
    const  filtered = state.navLegislations.filter((nav) => isMatchedSearched(nav.legislation, state.query));
    const filteredNavLegislations = sortNavigatorLegislationData(filtered, state.sortOrder);
    return { ...state, filters: finalFilters, filteredNavLegislations };
  },
  UPDATE_ACTIVE_FILTERS: (state: InitialState, action: NavigatorStateAction) => {
    const activeFiltersData = restore(ACTIVE_LEGISLATION_FILTERS_ID, { permanent: false });
    const { payload: { filterOptionId } } = action;

    const filters = activeFiltersData || state.filters;
    const finalFilters = updateFilterOptionsById(filters, filterOptionId);

    store(ACTIVE_LEGISLATION_FILTERS_ID, finalFilters, { permanent: false });
    const  filtered = state.navLegislations.filter((nav) => isMatchedSearched(nav.legislation, state.query));
    const filteredNavLegislations = sortNavigatorLegislationData(filtered, state.sortOrder);
    return { ...state, filters: finalFilters, filteredNavLegislations };
  },
  SET_FILTER_BY: (state: InitialState, action: NavigatorStateAction) => {
    const { filterValue } = action.payload;

    return {
      ...state,
      filterValue,
      filteredNavLegislations: sortNavigatorLegislationByFilterKey(state.navLegislations, filterValue),
    };
  },

  // QUERY
  SET_QUERY: (state: InitialState, action: NavigatorStateAction) => {
    const { query } = action.payload;

    const queryValue = query.toLowerCase();
    const  filtered = state.navLegislations.filter((nav) => isMatchedSearched(nav.legislation, queryValue));
    const filteredNavLegislations = sortNavigatorLegislationData(filtered, state.sortOrder);

    return { ...state, query: queryValue, filteredNavLegislations };
  },

  // SORTING
  SET_SORT_ORDER: (state: InitialState, action: NavigatorStateAction) => {
    const { sortOrder } = action.payload;
    return { ...state, sortOrder };
  },
  SORT_NAV_LEGISLATIONS: (state: InitialState, action: NavigatorStateAction) => {
    const { sortValue } = action.payload;

    const filteredNavLegislations = sortNavigatorLegislationData(state.navLegislations, sortValue);

    return { ...state, sortValue, filteredNavLegislations };
  },

  // FETCHING && LOADING
  UPDATE_LOADING_STATE: (state: InitialState, action: NavigatorStateAction) => {
    const { isLoading } = action.payload;
    return { ...state, isLoading };
  },
  UPDATE_FETCHING_STATE: (state: InitialState, action: NavigatorStateAction) => {
    const { isFetching } = action.payload;
    return { ...state, isFetching };
  },

  // TABS
  SET_NAV_LEGISLATION_TABS: (state: InitialState, action: NavigatorStateAction) => {
    const { tabs } = action.payload;
    return { ...state, tabs };
  },
};

//-------------------------------------------------------------------
/**
 * Navigator State Reducer Function
 */
const navigatorStateReducerFunction: Reducer<InitialState, NavigatorStateAction> = (state: InitialState, action: NavigatorStateAction) =>
  navigatorReducer[action['type'] as ActionTypes](state, action);


export default useNavigatorReducer;
