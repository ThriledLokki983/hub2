import { Reducer, useReducer, useMemo } from 'react';

import { SITE_TITLE } from 'configs/constants';

import { CustomRouteObject } from 'configs/interfaces';
import { getMatchingBreakpoints } from "helpers/utils";
import {
  Actions,
  InitialState as AppState,
  AppStateAction,
  ActionCreators,
  AppStateReducer,
  ActionTypes,
} from 'hooks/interfaces';


/**
 * This is a custom useReducer hook leveraging React useReducer hook but in turn has
 * custom created actions that will take care of manipulating our state without making
 * a messing up with the state.
 * @param initState - Initial state of the app.
 * @returns [state, dispatch, appActions] |
 * @description | state - Current state of the app.
 * @description | dispatch - Dispatch function to update the state.
 * @description | appActions - Custom actions to make changes to the state.
 */
const useAppStateReducer = (initState: AppState): AppStateReducer => {
  const [state, dispatch] = useReducer<Reducer<AppState, AppStateAction>>(appStateReducerFunction, initState || {}, undefined);

  const actionCreators: ActionCreators = useMemo(() => ({
    UPDATE_ROUTE: (route: CustomRouteObject, title: string) => ({
      type: "UPDATE_ROUTE",
      payload: { route, title },
    }),
    UPDATE_PAGE_TITLE: (title: string) => ({
      type: "UPDATE_PAGE_TITLE",
      payload: { title: title ? `${title} | ${SITE_TITLE}` : SITE_TITLE },
    }),
    UPDATE_BREAKPOINTS: (cssBreakPoints: number[]) => ({
      type: "UPDATE_BREAKPOINTS",
      payload: { matchingBreakpoints: getMatchingBreakpoints(cssBreakPoints) },
    }),
    UPDATE_STATE_LOADING: (isLoading: boolean) => ({
      type: "UPDATE_STATE_LOADING",
      payload: { isLoading },
    }),
    UPDATE_STATE_FETCHING: (isFetching: boolean) => ({
      type: "UPDATE_STATE_FETCHING",
      payload: { isFetching },
    }),
  }), []);

  const actions: Actions = useMemo(() => ({
    updateRoute: actionCreators["UPDATE_ROUTE"],
    updatePageTitle: actionCreators["UPDATE_PAGE_TITLE"],
    updateBreakPoints: actionCreators["UPDATE_BREAKPOINTS"],
    updateStateLoading: actionCreators["UPDATE_STATE_LOADING"],
    updateStateFetching: actionCreators["UPDATE_STATE_FETCHING"],
  }), [actionCreators]);

  return [state, dispatch, actions];
};

/**
 * This is a custom reducer object that will update the state based on the action type.
 * @param state - Current state of the app.
 * @param action - Action to be performed on the state.
 * @returns Updated state.
 */
const appStateReducer: Record<ActionTypes, AppStateActionHandler> = {
  UPDATE_ROUTE: (state: AppState, action: AppStateAction) => {
    const { payload: { route }} = action;
    return { ...state, route };
  },
  UPDATE_PAGE_TITLE: (state: AppState, action: AppStateAction) => {
    const { payload: { title } } = action;
    return { ...state, title };
  },
  UPDATE_BREAKPOINTS: (state: AppState, action: AppStateAction) => {
    const { payload: { matchingBreakpoints } } = action;
    return { ...state, matchingBreakpoints };
  },
  UPDATE_STATE_LOADING: (state: AppState, action: AppStateAction) => {
    const { payload: { isLoading } } = action;
    return { ...state, isLoading };
  },
  UPDATE_STATE_FETCHING: (state: AppState, action: AppStateAction) => {
    const { payload: { isFetching } } = action;
    return { ...state, isFetching };
  },
};

/**
 * This is a custom reducer function that will take care of updating the state based
 * on the action type using the reducer object above.
 * @param state
 * @param action
 * @returns Updated state.
 */
const appStateReducerFunction: Reducer<AppState, AppStateAction> = (state, action) =>
  appStateReducer[action['type'] as ActionTypes](state, action)

interface AppStateActionHandler {
  (state: AppState, action: AppStateAction): AppState;
}

export default useAppStateReducer;
