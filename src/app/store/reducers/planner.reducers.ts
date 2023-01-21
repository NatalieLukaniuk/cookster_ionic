import { PlannerByDate } from 'src/app/models/planner.models';
import { PlannerActions, PlannerActionTypes } from '../actions/planner.actions';

export interface PlannerState {
  currentPlanner: PlannerByDate | null;
}

export const InitialPlannerState: PlannerState = {
  currentPlanner: null,
};

export function PlannerReducers(
  state: PlannerState = InitialPlannerState,
  action: PlannerActions
): PlannerState {
  switch (action.type) {
    case PlannerActionTypes.SET_PLANNER: {
      return {
        ...state,
        currentPlanner: action.planner,
      };
    }

    // case PlannerActionTypes.RESET_CURRENT_PLANNER_BY_DATE: {
    //   return {
    //     ...state,
    //     currentPlanner: null,
    //   };
    // }
    default:
      return { ...state };
  }
}
