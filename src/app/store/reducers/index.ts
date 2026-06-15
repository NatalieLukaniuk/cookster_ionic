import { ActionReducerMap } from '@ngrx/store';

import { CalendarReducers, CalendarState, InitialCalendarState } from './calendar.reducers';
import { InitialUserState, IUserState, UserReducers } from './user.reducer';
import { InitialRecipiesState, IRecipiesState, RecipiesReducers } from './recipies.reducer';
import { CommentsReducers, CommentsState, InitialCommentsState } from './comments.reducers';

export interface IAppState {
  calendar: CalendarState,
  user: IUserState,
  recipies: IRecipiesState,
  comments: CommentsState
}

export const InitialAppState: IAppState = {
  calendar: InitialCalendarState,
  user: InitialUserState,
  recipies: InitialRecipiesState,
  comments: InitialCommentsState
}

export const reducers: ActionReducerMap<IAppState, any> = {
  calendar: CalendarReducers,
  user: UserReducers,
  recipies: RecipiesReducers,
  comments: CommentsReducers
};
