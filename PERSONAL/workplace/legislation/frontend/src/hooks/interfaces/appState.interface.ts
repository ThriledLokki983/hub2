import { Dispatch } from 'react';

import { CustomRouteObject, CssBreakPointsInterface } from 'configs/interfaces';

export type GuidedTour = 'initial' | 'roles' | 'filters' | 'role content' | 'completed';

interface InitialState {
  route: object | any,
  title: string;
  isLoading: boolean;
  isFetching: boolean,
  tourStep: GuidedTour;
  matchingBreakpoints: string[]
}

type ErrorToastOptions = Omit<ToastInterface, 'type'>
type MessageToastOptions = Omit<ToastInterface, 'type' | 'persistent'>

interface AppStateAction {
  type: string;
  payload?: any
}

interface ToastInterface {
  options?: object | null;
  active: boolean;
  type?: 'success' | 'error' | 'warning' | 'info' | 'message' | string,
  title?: string,
  message?: string,
  persistent?: boolean,
  orientation?: 'left' | 'right',
  reload?: boolean,
  button?: {
    label: string,
    url: string,
  },
}

interface AppState {
  state: InitialState;
  stateDispatch: Dispatch<AppStateAction>;
  stateActions: any;

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
  dispatch: any,
  actions: any,
]

type ActionTypes =
  "UPDATE_ROUTE"
  | "UPDATE_TOUR_STEP"
  | "UPDATE_PAGE_TITLE"
  | "UPDATE_BREAKPOINTS"
  | "UPDATE_STATE_LOADING"
  | "UPDATE_STATE_FETCHING"


type Actions = {
  updateRoute: (route: CustomRouteObject) => AppStateAction;
  updatePageTitle: (title: string) => AppStateAction;
  updateBreakPoints: (cssBreakPoints: CssBreakPointsInterface) => AppStateAction;
  updateStateLoading: (isLoading: boolean) => AppStateAction;
  updateStateFetching: (isFetching: boolean) => AppStateAction;
  updateTourStep: (step: number) => AppStateAction;
};

type ActionCreator<T extends ActionTypes> = (...args: any[]) => { type: T; payload: any };

type ActionCreators = {
  [K in ActionTypes]: ActionCreator<K>;
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
}
