import { ActionReducerMap } from '@ngrx/store';

import { CalendarReducers, CalendarState, InitialCalendarState } from './calendar.reducers';
import { InitialUiState, UiReducers, UiState } from './ui.reducer';
import { InitialUserState, IUserState, UserReducers } from './user.reducer';
import { InitialRecipiesState, IRecipiesState, RecipiesReducers } from './recipies.reducer';
import { CommentsReducers, CommentsState, InitialCommentsState } from './comments.reducers';
import { ExpensesReducers, ExpensesState, InitialExpensesState } from './expenses.reducer';

export interface IAppState {
  ui: UiState,
  calendar: CalendarState,
  user: IUserState,
  recipies: IRecipiesState,
  comments: CommentsState,
  expenses: ExpensesState
}

export const InitialAppState: IAppState = {
  ui: InitialUiState,
  calendar: InitialCalendarState,
  user: InitialUserState,
  recipies: InitialRecipiesState,
  comments: InitialCommentsState,
  expenses: InitialExpensesState
}

export const reducers: ActionReducerMap<IAppState, any> = {
  ui: UiReducers,
  calendar: CalendarReducers,
  user: UserReducers,
  recipies: RecipiesReducers,
  comments: CommentsReducers,
  expenses: ExpensesReducers
};
