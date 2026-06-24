import { ActionReducerMap } from '@ngrx/store';

import { CommentsReducers, CommentsState, InitialCommentsState } from './comments.reducers';

export interface IAppState {
  comments: CommentsState
}

export const InitialAppState: IAppState = {

  comments: InitialCommentsState
}

export const reducers: ActionReducerMap<IAppState, any> = {

  comments: CommentsReducers
};
