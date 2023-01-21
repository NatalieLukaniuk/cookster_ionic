import { PlannerByDate } from './../../models/planner.models';
import { ErrorAction } from './../actions/ui.actions';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { map, switchMap, take } from 'rxjs/operators';
// import {
//   PlannerActionTypes,
//   SetCurrentPlannerByDateAction,
// } from './../actions/planner.actions';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { IAppState } from '../reducers';
import * as PlannerActions from '../actions/planner.actions';

@Injectable()
export class PlannerEffects {
  constructor(private actions$: Actions, private store: Store<IAppState>) {}

  // setCurrentPlanner$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(PlannerActionTypes.SET_CURRENT_PLANNER_BY_DATE),
  //     switchMap((action: SetCurrentPlannerByDateAction) =>
  //       this.store.pipe(
  //         select(getCurrentUser),
  //         take(1),
  //         map((user) => {
  //           if (user && user.planner) {
  //             let currentPlanner = user.planner.find(
  //               (planner: PlannerByDate) => planner.id == action.route
  //             );
  //             if (currentPlanner) {
  //               return new PlannerActions.SetPlannerAction(currentPlanner);
  //             } else return new ErrorAction('no planner with this id');
  //           } else return new ErrorAction('no user');
  //         })
  //       )
  //     )
  //   )
  // );
}
