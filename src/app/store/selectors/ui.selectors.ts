import { createSelector } from '@ngrx/store';

import { IAppState } from '../reducers';
import { UiState } from '../reducers/ui.reducer';

const getUIState = (state: IAppState) => state.ui;
export const getIsLoading = createSelector(
  getUIState,
  (state: UiState) => state.isLoading
);
export const getIsSuccessMessage = createSelector(
  getUIState,
  (state: UiState) => state.successMessage
);
export const getIsError = createSelector(
  getUIState,
  (state: UiState) => state.error
);
export const getIsSidebarOpen = createSelector(
  getUIState,
  (state: UiState) => state.isSidebarOpen
);

export const getCurrentRoute = createSelector(
  getUIState,
  (state: UiState) => state.currentRoute
);
export const getPreviousRoute = createSelector(
  getUIState,
  (state: UiState) => state.previousRoute
);
