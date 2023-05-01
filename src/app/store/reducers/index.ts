import { PlannerState, InitialPlannerState, PlannerReducers } from './planner.reducers';
import { ActionReducerMap } from '@ngrx/store';

import { CalendarReducers, CalendarState, InitialCalendarState } from './calendar.reducers';
import { InitialUiState, UiReducers, UiState } from './ui.reducer';
import { InitialUserState, IUserState, UserReducers } from './user.reducer';
import { InitialRecipiesState, IRecipiesState, RecipiesReducers } from './recipies.reducer';

export interface IAppState {
  ui: UiState,
  calendar: CalendarState,
  planner: PlannerState,
  user: IUserState,
  recipies: IRecipiesState
}

export const InitialAppState: IAppState = {
  ui: InitialUiState,
  calendar: InitialCalendarState,
  planner: InitialPlannerState,
  user: InitialUserState,
  recipies: InitialRecipiesState
}

export const reducers: ActionReducerMap<IAppState, any> = {
  ui: UiReducers,
  calendar: CalendarReducers,
  planner: PlannerReducers,
  user: UserReducers,
  recipies: RecipiesReducers
};
