import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IUserState } from '../reducers/user.reducer';

export const FeatureName = 'user';
export const getUserState = createFeatureSelector<IUserState>(FeatureName);
export const getCurrentUser = createSelector(
  getUserState,
  (state) => state.currentUser
);
export const getUserPlannedRecipies = createSelector(
  getUserState,
  (state) => state.currentUser?.details
);

export const getUserShoppingList = createSelector(
  getUserState,
  (state) => state.currentUser?.shoppingLists
);

export const getFamilyMembers = createSelector(getUserState, (state) => state.currentUser?.family);

export const getUserPreferences = createSelector(getUserState, (state) => state.currentUser?.preferences);

export const getUserCollections = createSelector(getUserState, (state) => state.currentUser?.collections);