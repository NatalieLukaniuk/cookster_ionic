import { PlannerState, InitialPlannerState, PlannerReducers } from './planner.reducers';
import { ActionReducerMap } from '@ngrx/store';

import { CalendarReducers, CalendarState, InitialCalendarState } from './calendar.reducers';
import { InitialUiState, UiReducers, UiState } from './ui.reducer';
import { InitialUserState, IUserState, UserReducers } from './user.reducer';
import { InitialRecipiesState, IRecipiesState, RecipiesReducers } from './recipies.reducer';
import { CommentsReducers, CommentsState, InitialCommentsState } from './comments.reducers';

export interface IAppState {
  ui: UiState,
  calendar: CalendarState,
  planner: PlannerState,
  user: IUserState,
  recipies: IRecipiesState,
  comments: CommentsState
}

export const InitialAppState: IAppState = {
  ui: InitialUiState,
  calendar: InitialCalendarState,
  planner: InitialPlannerState,
  user: InitialUserState,
  recipies: InitialRecipiesState,
  comments: InitialCommentsState
}

export const reducers: ActionReducerMap<IAppState, any> = {
  ui: UiReducers,
  calendar: CalendarReducers,
  planner: PlannerReducers,
  user: UserReducers,
  recipies: RecipiesReducers,
  comments: CommentsReducers
};
