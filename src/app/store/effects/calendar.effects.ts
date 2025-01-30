import { AddRecipyToCalendarActionNew, UpdateRecipyInCalendarActionNew, RemoveRecipyFromCalendarActionNew, AddCommentToCalendarAction } from './../actions/calendar.actions';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { map, switchMap, take } from 'rxjs/operators';
import {
  CalendarActionTypes,
} from '../actions/calendar.actions';
import { ErrorAction } from '../actions/ui.actions';
import { UpdateUserAction } from '../actions/user.actions';
import { IAppState } from '../reducers';
import { getCurrentUser } from '../selectors/user.selectors';
import { User } from 'src/app/models/auth.models';
import { CalendarComment, CalendarRecipyInDatabase_Reworked } from 'src/app/models/calendar.models';

@Injectable()
export class CalendarEffects {
  
  addRecipyToCal_Rework$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CalendarActionTypes.ADD_RECIPY_TO_CALENDAR_NEW),
      switchMap((action: AddRecipyToCalendarActionNew) =>
        this.store.pipe(
          select(getCurrentUser),
          take(1),
          map((user) => {
            if (user) {
              let updatedUser = _.cloneDeep(user);
              if (!updatedUser.plannedRecipies) {
                updatedUser.plannedRecipies = [];
              }
              let recipyToSave: CalendarRecipyInDatabase_Reworked = {
                recipyId: action.recipyEntry.id,
                portions: action.recipyEntry.portions,
                amountPerPortion: action.recipyEntry.amountPerPortion,
                endTime: action.recipyEntry.endTime,
                entryId: action.recipyEntry.entryId
              }
              updatedUser.plannedRecipies?.push(recipyToSave)

              return new UpdateUserAction(
                updatedUser,
                `${action.recipyEntry.name} додано`
              );
            } else return new ErrorAction('no user');
          })
        )
      )
    )
  );

  addCommentToCalendar$ = createEffect(() => 
  this.actions$.pipe(
    ofType(CalendarActionTypes.ADD_COMMENT_TO_CALENDAR),
    switchMap((action: AddCommentToCalendarAction) => 
    this.store.pipe(select(getCurrentUser), take(1), map((user: User | null) => {
      if (user) {
        let updatedUser = _.cloneDeep(user);
        if(!updatedUser.plannedComments){
          updatedUser.plannedComments = []
        }
        let comment: CalendarComment = {
          comment: action.comment,
          date: action.selectedDate,
          isReminder: action.isReminder
        }
        updatedUser.plannedComments?.push(comment)
        return new UpdateUserAction(
          updatedUser,
          `${action.isReminder? 'Нагадування' : 'Коментар'} додано`
        );
      } else return new ErrorAction('no user');
    })))
  ))

  updateRecipyInCalendar_Reworked$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CalendarActionTypes.UPDATE_RECIPY_IN_CALENDAR_NEW),
      switchMap((action: UpdateRecipyInCalendarActionNew) =>
        this.store.pipe(
          select(getCurrentUser),
          take(1),
          map((user: User | null) => {
            if (user) {
              let updatedUser = _.cloneDeep(user);
              updatedUser.plannedRecipies = updatedUser.plannedRecipies!.map(recipy => {
                if (
                  recipy.recipyId === action.previousEntry.id &&
                  recipy.portions === action.previousEntry.portions &&
                  recipy.amountPerPortion === action.previousEntry.amountPerPortion &&
                  action.previousEntry.endTime === recipy.endTime) {
                  let recipyToSave: CalendarRecipyInDatabase_Reworked = {
                    recipyId: action.newEntry.id,
                    portions: action.newEntry.portions,
                    amountPerPortion: action.newEntry.amountPerPortion,
                    endTime: action.newEntry.endTime,
                    entryId: action.newEntry.entryId
                  }
                  return recipyToSave
                } else {
                  return recipy
                }
              })
              return new UpdateUserAction(
                updatedUser,
                `${action.newEntry.name} оновлено`
              );
            } else return new ErrorAction('no user');
          })
        )
      )
    )
  );

  removeRecipyFromCalendar_Reworked$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CalendarActionTypes.REMOVE_RECIPY_FROM_CALENDAR_NEW),
      switchMap((action: RemoveRecipyFromCalendarActionNew) =>
        this.store.pipe(
          select(getCurrentUser),
          take(1),
          map((user: User | null) => {
            if (user) {
              let updatedUser = _.cloneDeep(user);
              updatedUser.plannedRecipies = updatedUser.plannedRecipies!.filter(recipy => {
                return !(
                  recipy.recipyId === action.recipyEntry.id &&
                  recipy.portions === action.recipyEntry.portions &&
                  recipy.amountPerPortion === action.recipyEntry.amountPerPortion &&
                  action.recipyEntry.endTime === recipy.endTime)
              })
              return new UpdateUserAction(
                updatedUser,
                `${action.recipyEntry.name} видалено`
              );
            } else return new ErrorAction('no user');
          })
        )
      )
    )
  );


  constructor(private actions$: Actions, private store: Store<IAppState>) { }
}
