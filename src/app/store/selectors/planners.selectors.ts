import { PlannerState } from './../reducers/planner.reducers';
import { createSelector } from '@ngrx/store';
import { IAppState } from '../reducers';

const getPlannerState = (state: IAppState) => state.planner;
export const getCurrentPlanner = createSelector(
  getPlannerState,
  (state: PlannerState) => state.currentPlanner
);
