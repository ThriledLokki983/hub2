import { Reducer, useReducer, useMemo } from 'react';
import { store, restore, isMatchedSearched }  from 'helpers/utils';

import { ACTIVE_LEGISLATION_FILTERS_ID } from 'configs/legislation/legislation';
import {
  updateFilters, updateOption, filterData,
  updateFilterOptionsById, sortLegislationTabsData,
  sortLegislationsData,
  sortFilterBy,
  sortLegislationTabsByFilterKey,
} from './helpers';
import {
  Legislation,
  InitialState,
  LegislationStateAction,
  Actions,
  ActionCreators,
  LegislationReducer,
  ActionTypes,
  Filter,
  FilterOption,
  EnumActionTypes,
} from 'hooks/interfaces/legislation.interface';

const useLegislationStateReducer = (initState: InitialState): LegislationReducer => {
  const [state, dispatch] = useReducer<Reducer<InitialState, LegislationStateAction>>(legislationStateReducerFunction, initState || {}, undefined);

  const actionCreators: ActionCreators = useMemo(() => ({
    INIT_STATE: (initState: InitialState, permission: 'approver' | 'preparer' | 'viewer') => ({
      type: "INIT_STATE",
      payload: { initState, permission },
    }),
    SORT_LEGISLATIONS: (sortPage: string, sortOrder: string) => ({
      type: "SORT_LEGISLATIONS",
      payload: { sortPage, sortOrder },
    }),
    INIT_ACTIVE_FILTERS: (filters: any) => ({
      type: "INIT_ACTIVE_FILTERS",
      payload: { filters },
    }),
    UPDATE_LOADING_STATE: (isLoading: boolean) => ({
      type: "UPDATE_LOADING_STATE",
      payload: { isLoading },
    }),
    UPDATE_FETCHING_STATE: (isFetching: boolean) => ({
      type: "UPDATE_FETCHING_STATE",
      payload: { isFetching },
    }),
    SET_CURRENT: (current: Legislation) => ({
      type: "SET_CURRENT",
      payload: { current },
    }),
    SET_ACTIVE_FILTERS: (isFilterChecked: boolean, filterOption: any, filterValue: string) => ({
      type: "SET_ACTIVE_FILTERS",
      payload: { isFilterChecked, filterOption, filterValue },
    }),
    SET_FILTER_BY: (filterValue: string) => ({
      type: "SET_FILTER_BY",
      payload: { filterValue }
    }),
    UPDATE_ACTIVE_FILTERS: (isFilterChecked: boolean, filterOption: any, filterValue: string) => ({
      type: "UPDATE_ACTIVE_FILTERS",
      payload: { isFilterChecked, filterOption, filterValue },
    }),
    SET_QUERY: (query: string) => ({
      type: "SET_QUERY",
      payload: { query },
    }),
    SET_SORT_ORDER: (sortOrder: string) => ({
      type: "SET_SORT_ORDER",
      payload: { sortOrder },
    }),
    SET_LEGISLATION_TABS: (tabs: Legislation[]) => ({
      type: "SET_LEGISLATION_TABS",
      payload: { tabs },
    }),
  }), []);

  const actions: Actions = useMemo(() => ({
    initState: actionCreators["INIT_STATE"],
    sortLegislations: actionCreators["SORT_LEGISLATIONS"],
    initActiveFilters: actionCreators["INIT_ACTIVE_FILTERS"],
    updateLoadingState: actionCreators["UPDATE_LOADING_STATE"],
    updateFetchingState: actionCreators["UPDATE_FETCHING_STATE"],
    seCurrentLegislation: actionCreators["SET_CURRENT"],
    setActiveFilters: actionCreators["SET_ACTIVE_FILTERS"],
    updateActiveFilters: actionCreators["UPDATE_ACTIVE_FILTERS"],
    setQuery: actionCreators["SET_QUERY"],
    setSortOrder: actionCreators["SET_SORT_ORDER"],
    setLegislationTabs: actionCreators["SET_LEGISLATION_TABS"],
    setFilterBy: actionCreators["SET_FILTER_BY"],
  }), [actionCreators]);

  return [state, dispatch, actions];
};

const legislationReducer: Record<ActionTypes, LegislationStateActionHandler> = {

  // INITIAL STATE
  [EnumActionTypes.INIT_STATE]: (state: InitialState, action: LegislationStateAction) => {
    const { payload: { initState, permission } } = action;
    const currentLegislation = state.legislations.length > 0 ? state.legislations[0] : {};

    return { ...state, ...initState, current: currentLegislation };
  },

  // FILTERS
  [EnumActionTypes.SET_ACTIVE_FILTERS]: (state: InitialState, action: LegislationStateAction) => {
    const activeFiltersData = restore(ACTIVE_LEGISLATION_FILTERS_ID, { permanent: false });
    const { payload: { isFilterChecked, filterOption, filterValue } } = action;

    const isSelectAllFilter = filterValue.toLowerCase().startsWith('all');

    const filters = activeFiltersData || state.filters;
    const existingFilter = filters.find((filter: Filter) => filter.name === filterOption.name);

    if (isSelectAllFilter) {
      const updatedFilters = filters.map((f: Filter) => {
        if (f.name === filterOption.name) {
          return {
            ...f,
            data: f.data.map((d: FilterOption) => ({ ...d, is_approved: isFilterChecked })),
          };
        }

        return f;
      });

      store(ACTIVE_LEGISLATION_FILTERS_ID, updatedFilters, { permanent: false });
      return { ...state, filters: updatedFilters, filteredLegislations: filterData(state.legislations, updatedFilters) as Legislation[], };
    }

    const isAllFilterChecked = filterOption.data.find((o: FilterOption) => o.identifier.includes('select-all-'))?.is_approved
      || filterOption.data.find((o: FilterOption) => o.name.startsWith('All'))?.is_approved;

    if (isAllFilterChecked) {
      const updatedFilters = filters.map((f: Filter) => {
        if (f.name === filterOption.name) {
          return {
            ...f,
            data: f.data.map((d: FilterOption) => {
              if (d.name === filterValue) {
                return { ...d, is_approved: !isFilterChecked };
              }
              return { ...d, is_approved: false };
            }),
          };
        }

        return f;
      });

      store(ACTIVE_LEGISLATION_FILTERS_ID, updatedFilters, { permanent: false });
      return { ...state, filters: updatedFilters, filteredLegislations: filterData(state.legislations, updatedFilters) as Legislation[], };
    }

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
    return { ...state, filters: finalFilters, filteredLegislations: filterData(state.legislations, finalFilters) as Legislation[], };
  },
  [EnumActionTypes.UPDATE_ACTIVE_FILTERS]: (state: InitialState, action: LegislationStateAction) => {
    const activeFiltersData = restore(ACTIVE_LEGISLATION_FILTERS_ID, { permanent: false });
    const { payload: { isFilterChecked, filterOption, filterValue } } = action;

    const filters = activeFiltersData || state.filters;
    const existingFilter = filters.find((filter: Filter) => filter?.name === filterOption?.name);
    const isAllFilterChecked = filterOption.data.find((o: FilterOption) => o.identifier.includes('select-all-'))?.is_approved;
    const isSelectAllFilter = filterValue.toLowerCase().includes('all') && filterValue.split(' ').length >= 2 && !filterValue.includes('/');


    // if (isAllFilterChecked) {
    //   const updatedFilters = filters.map((f: Filter) => {
    //     if (f.name === filterOption.name) {
    //       return {
    //         ...f,
    //         data: f.data.map((d: FilterOption) => {
    //           if (d.name === filterValue) {
    //             return { ...d, is_approved: isFilterChecked };
    //           }
    //           return { ...d, is_approved: false };
    //         }),
    //       };
    //     }

    //     return f;
    //   });

    //   store(ACTIVE_LEGISLATION_FILTERS_ID, updatedFilters, { permanent: false });
    //   return { ...state, filters: updatedFilters, filteredLegislations: filterData(state.legislations, updatedFilters) as Legislation[], };
    // }



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
    return { ...state, filters: finalFilters, filteredLegislations: filterData(state.legislations, finalFilters) as Legislation[], };
  },
  [EnumActionTypes.SET_FILTER_BY]: (state: InitialState, action: LegislationStateAction) => {
    const { payload: { filterValue } } = action;
    return {
      ...state,
      legislationTabs: sortLegislationTabsByFilterKey(state.legislationTabs, filterValue)
    };
  },
  [EnumActionTypes.INIT_ACTIVE_FILTERS]: (state: InitialState, action: LegislationStateAction) => {
    const { payload: { filters } } = action;
    return { ...state, activeFilters: filters };
  },

  // CURRENT LEGISLATION
  [EnumActionTypes.SET_CURRENT]: (state: InitialState, action: LegislationStateAction) => {
    const { payload: { current } } = action;
    const foundCurrentData = state.legislations.find((l) => l.identifier === current) || state.legislations[0];

    return { ...state, current: foundCurrentData };
  },

  // TABS
  [EnumActionTypes.SET_LEGISLATION_TABS]: (state: InitialState, action: LegislationStateAction) => {
    const { payload: { tabs } } = action;
    return { ...state, legislationTabs: tabs };
  },

  // QUERY
  [EnumActionTypes.SET_QUERY]: (state: InitialState, action: LegislationStateAction) => {
    const { payload: { query } } = action;

    const queryValue = query.toLowerCase();
    const  filtered = state.legislations.filter((legislation) => isMatchedSearched(legislation, queryValue));
    const filteredLegislations = filterData(sortLegislationsData(filtered, state.sortOrder), state.filters) as Legislation[];

    return { ...state, query: queryValue, filteredLegislations };
  },

  // SORTING
  [EnumActionTypes.SORT_LEGISLATIONS]: (state: InitialState, action: LegislationStateAction) => {
    const { payload: { sortPage, sortOrder } } = action;

    const sortedTabs = sortLegislationTabsData(state.legislationTabs.map((tab) => ({
      ...tab,
      // entries: filterData(tab.entries, state.filters),
    })), sortOrder)
      ;

    return {
      ...state,
      legislationTabs: sortedTabs,
    };
  },
  [EnumActionTypes.SET_SORT_ORDER]: (state: InitialState, action: LegislationStateAction) => {
    const { payload: { sortOrder } } = action;
    return { ...state, sortOrder };
  },

  // FETCHING && LOADING
  [EnumActionTypes.UPDATE_LOADING_STATE]: (state: InitialState, action: LegislationStateAction) => {
    const { payload: { isLoading } } = action;
    return { ...state, isLoading };
  },
  [EnumActionTypes.UPDATE_FETCHING_STATE]: (state: InitialState, action: LegislationStateAction) => {
    const { payload: { isFetching } } = action;
    return { ...state, isFetching };
  },
}

const legislationStateReducerFunction: Reducer<InitialState, LegislationStateAction> = (state, action) =>
  legislationReducer[action['type'] as ActionTypes](state, action);

interface LegislationStateActionHandler {
  (state: InitialState, action: LegislationStateAction): InitialState;
}

export default useLegislationStateReducer;
