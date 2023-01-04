import { Action } from '@ngrx/store';

export enum UiActionTypes {
  SET_IS_LOADING_TRUE = '[UI] Is Loading',
  SET_IS_LOADING_FALSE = '[UI] Loading Completed',
  SHOW_SUCCESS_MESSAGE = '[UI] Show Success Message',
  DISMISS_SUCCESS_MESSAGE = '[UI] Dismiss Success Message',
  SET_ERROR = '[DATA] Error',
  RESET_ERROR = '[DATA] Reset Error',
  SET_IS_SIDEBAR_OPEN = '[UI] Toggle Sidebar',
  SET_CURRENT_ROUTE = '[UI] Set Current Route',
}

export class SetCurrentRouteAction implements Action {
  readonly type = UiActionTypes.SET_CURRENT_ROUTE;
  constructor(public route: string) {}
}
export class SetIsSidebarOpenAction implements Action {
  readonly type = UiActionTypes.SET_IS_SIDEBAR_OPEN;
  constructor(public isSidebarOpen: boolean) {}
}
export class ErrorAction implements Action {
  readonly type = UiActionTypes.SET_ERROR;
  constructor(public details: any) {}
}

export class ResetErrorAction implements Action {
  readonly type = UiActionTypes.RESET_ERROR;
  constructor() {}
}

export class SetIsLoadingAction implements Action {
  readonly type = UiActionTypes.SET_IS_LOADING_TRUE;
  constructor() {}
}

export class SetIsLoadingFalseAction implements Action {
  readonly type = UiActionTypes.SET_IS_LOADING_FALSE;
  constructor() {}
}

export class ShowSuccessMessageAction implements Action {
  readonly type = UiActionTypes.SHOW_SUCCESS_MESSAGE;
  constructor(public message: string) {}
}

export class DismissSuccessMessageAction implements Action {
  readonly type = UiActionTypes.DISMISS_SUCCESS_MESSAGE;
  constructor() {}
}

export type UiActions =
  | SetIsLoadingAction
  | SetIsLoadingFalseAction
  | ShowSuccessMessageAction
  | DismissSuccessMessageAction
  | ErrorAction
  | ResetErrorAction
  | SetIsSidebarOpenAction
  | SetCurrentRouteAction;
