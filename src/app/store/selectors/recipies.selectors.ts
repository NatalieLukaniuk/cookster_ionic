import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IRecipiesState } from '../reducers/recipies.reducer';

export const FeatureName = 'recipies';
export const getRecipiesState =
  createFeatureSelector<IRecipiesState>(FeatureName);
export const getAllRecipies = createSelector(
  getRecipiesState,
  (state) => state.allRecipies
);
