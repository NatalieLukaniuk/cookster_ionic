import { Action } from '@ngrx/store';
import { User } from 'src/app/models/auth.models';

export enum UserActionTypes {
  USER_LOADED = '[USER] User Loaded',
  USER_LOGGED_OUT = '[USER] Logged Out',
  GET_USER = '[USER] Get User',
  UPDATE_USER = '[USER] Update User',
  UPDATE_USER_SUCCESSFUL = '[USER] User Has Been Updated',
  CREATE_RECIPY_COLLECTION = '[USER] Create Recipy Collection',
}

export class UserLoggedOutAction implements Action {
  readonly type = UserActionTypes.USER_LOGGED_OUT;
  constructor() {}
}

export class CreateRecipyCollection implements Action {
  readonly type = UserActionTypes.CREATE_RECIPY_COLLECTION;
  constructor(public collectionName: string) {}
}

export class UpdateUserAction implements Action {
  readonly type = UserActionTypes.UPDATE_USER;
  constructor(public user: Partial<User>) {}
}

export class UpdateUserSuccessfulAction implements Action {
  readonly type = UserActionTypes.UPDATE_USER_SUCCESSFUL;
  constructor(public response: User) {}
}

export class GetUserAction implements Action {
  readonly type = UserActionTypes.GET_USER;
  constructor() {}
}

export class UserLoadedAction implements Action {
  readonly type = UserActionTypes.USER_LOADED;
  constructor(public user: User) {}
}

export type UserActions =
  | GetUserAction
  | UserLoadedAction
  | UpdateUserAction
  | UpdateUserSuccessfulAction
  | CreateRecipyCollection
  | UserLoggedOutAction;
