import { Action } from '@ngrx/store';
import { PlannerByDate } from 'src/app/models/planner.models';

export enum PlannerActionTypes {
  // SET_CURRENT_PLANNER_BY_DATE = '[Planner] Set Current Planner By Date',
  // RESET_CURRENT_PLANNER_BY_DATE = '[Planner] Reset Current Planner By Date',
  SET_PLANNER = '[Planner] Set Current Planner',
}

export class SetPlannerAction implements Action {
  readonly type = PlannerActionTypes.SET_PLANNER;
  constructor(public planner: PlannerByDate) {}
}

// export class SetCurrentPlannerByDateAction implements Action {
//   readonly type = PlannerActionTypes.SET_CURRENT_PLANNER_BY_DATE;
//   constructor(public route: string) {}
// }

// export class ResetCurrentPlannerByDateAction implements Action {
//   readonly type = PlannerActionTypes.RESET_CURRENT_PLANNER_BY_DATE;
//   constructor() {}
// }

export type PlannerActions =
  // | SetCurrentPlannerByDateAction
  // | ResetCurrentPlannerByDateAction
  | SetPlannerAction;
