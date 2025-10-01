import { Dispatch } from 'react';

import { CustomRouteObject } from 'configs/interfaces';

interface InitialState {
  route: object | Record<string, unknown>;
  title: string;
  isLoading: boolean;
  isFetching: boolean;
  matchingBreakpoints: string[];
}

type ErrorToastOptions = Omit<ToastInterface, 'type'>;
type MessageToastOptions = Omit<ToastInterface, 'type' | 'persistent'>;

// Define specific payload types for each action
interface RoutePayload {
  route: CustomRouteObject;
  title?: string;
}
interface TitlePayload {
  title: string;
}
interface BreakpointsPayload {
  matchingBreakpoints: string[];
}
interface LoadingPayload {
  isLoading: boolean;
}
interface FetchingPayload {
  isFetching: boolean;
}

// Union type of all possible payloads
type ActionPayload =
  | RoutePayload
  | TitlePayload
  | BreakpointsPayload
  | LoadingPayload
  | FetchingPayload;

interface AppStateAction {
  type: ActionTypes;
  payload: ActionPayload;
}

interface ToastInterface {
  options?: Record<string, unknown> | null;
  active: boolean;
  type?: 'success' | 'error' | 'warning' | 'info' | 'message' | string;
  title?: string;
  message?: string;
  persistent?: boolean;
  reload?: boolean;
  button?: {
    label: string;
    url: string;
  };
}

interface AppState {
  state: InitialState;
  stateDispatch: Dispatch<AppStateAction>;
  stateActions: Record<string, (...args: unknown[]) => AppStateAction>;

  toast: ToastInterface;
  hideToast: () => void;
  showToast: (toast: ToastInterface) => void;
  hasToast: boolean;

  showError: (toast: ToastInterface) => void;
  hideError: () => void;
  hasError: boolean;

  showMessage: (toast: ToastInterface) => void;
  hideMessage: () => void;
  hasMessage: boolean;
}

type AppStateReducer = [
  state: InitialState,
  dispatch: Dispatch<AppStateAction>,
  actions: Record<string, (...args: unknown[]) => AppStateAction>,
];

type ActionTypes =
  | 'UPDATE_ROUTE'
  | 'UPDATE_PAGE_TITLE'
  | 'UPDATE_BREAKPOINTS'
  | 'UPDATE_STATE_LOADING'
  | 'UPDATE_STATE_FETCHING';

type Actions = {
  updateRoute: (route: CustomRouteObject) => AppStateAction;
  updatePageTitle: (title: string) => AppStateAction;
  updateBreakPoints: (cssBreakPoints: number[]) => AppStateAction; // Changed from CssBreakPointsInterface to number[]
  updateStateLoading: (isLoading: boolean) => AppStateAction;
  updateStateFetching: (isFetching: boolean) => AppStateAction;
};

type ActionCreator<T extends ActionTypes, P extends ActionPayload> = (...args: any[]) => {
  type: T;
  payload: P;
};

type ActionCreators = {
  [K in ActionTypes]: K extends 'UPDATE_ROUTE'
    ? ActionCreator<K, RoutePayload>
    : K extends 'UPDATE_PAGE_TITLE'
      ? ActionCreator<K, TitlePayload>
      : K extends 'UPDATE_BREAKPOINTS'
        ? ActionCreator<K, BreakpointsPayload>
        : K extends 'UPDATE_STATE_LOADING'
          ? ActionCreator<K, LoadingPayload>
          : K extends 'UPDATE_STATE_FETCHING'
            ? ActionCreator<K, FetchingPayload>
            : never;
};

export type {
  ActionCreators,
  Actions,
  ActionTypes,
  AppState,
  AppStateAction,
  AppStateReducer,
  ErrorToastOptions,
  InitialState,
  MessageToastOptions,
  ToastInterface,
  ActionPayload,
  RoutePayload,
  TitlePayload,
  BreakpointsPayload,
  LoadingPayload,
  FetchingPayload,
};
