import {
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
} from './appState.interface';

import  {
  ApiResult,
  ConnectInterface,
  ConnectOptions,
  ErrorResponse,
  FetchesActiveType,
} from './api.interface';

import {
  ContextProps,
  UserInterface,
  UserDataInterface,
  UserProfile,
} from './user.interface';

import {
  Legislation,
  LegislationStateAction,
  LegislationState,
  LegislationReducer,
} from './legislation.interface';

interface AdminData {
  is_approver: boolean;
  is_preparer: boolean;
}

export type {
  AdminData,

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

  ApiResult,
  ConnectInterface,
  ConnectOptions,
  ErrorResponse,
  FetchesActiveType,

  ContextProps,
  UserInterface,
  UserDataInterface,
  UserProfile,

  LegislationState,
  LegislationStateAction,
  LegislationReducer,
  Legislation,
}
