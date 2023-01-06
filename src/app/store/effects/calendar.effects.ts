import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { map, switchMap, take } from 'rxjs/operators';
import { CalendarRecipyInDatabase, Day, IDayDetails, MealTime } from 'src/app/models/calendar.models';

import {
  AddRecipyToCalendarAction,
  CalendarActionTypes,
  MoveRecipyInCalendarAction,
  RemoveRecipyFromCalendarAction,
} from '../actions/calendar.actions';
import { ErrorAction } from '../actions/ui.actions';
import { UpdateUserAction } from '../actions/user.actions';
import { IAppState } from '../reducers';
import { getCurrentUser } from '../selectors/user.selectors';

@Injectable()
export class CalendarEffects {
  removeRecipyFromCal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CalendarActionTypes.REMOVE_RECIPY_FROM_CALENDAR),
      switchMap((action: RemoveRecipyFromCalendarAction) =>
        this.store.pipe(
          select(getCurrentUser),
          take(1),
          map((user) => {
            if (user && user.details) {
              let updatedUser = _.cloneDeep(user);
              updatedUser.details = updatedUser.details!.map((day: IDayDetails) => {
                if (day.day == action.day) {
                  day = this.updateDayOnRemoveRecipy(
                    day,
                    action.mealtime,
                    action.recipyId
                  );
                  return day;
                } else return day;
              });
              return new UpdateUserAction(updatedUser);
            } else return new ErrorAction('no user');
          })
        )
      )
    )
  );

  addRecipyToCal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CalendarActionTypes.ADD_RECIPY_TO_CALENDAR),
      switchMap((action: AddRecipyToCalendarAction) =>
        this.store.pipe(
          select(getCurrentUser),
          take(1),
          map((user) => {
            if (user && user.details) {
              let updatedUser = _.cloneDeep(user);
              updatedUser.details = updatedUser.details!.map((day: IDayDetails) => {
                if (day.day == action.day) {
                  day = this.updateDayOnAddRecipy(
                    day,
                    action.mealtime,
                    {
                      recipyId: action.recipyId,
                      portions: action.portions,
                      amountPerPortion: action.amountPerPortion,
                    },
                    action.order
                  );
                  return day;
                } else return day;
              });
              return new UpdateUserAction(updatedUser);
            } else return new ErrorAction('no user');
          })
        )
      )
    )
  );

  moveRecipyInCal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CalendarActionTypes.MOVE_RECIPY_IN_CALENDAR),
      switchMap((action: MoveRecipyInCalendarAction) =>
        this.store.pipe(
          select(getCurrentUser),
          take(1),
          map((user) => {
            if (user && user.details) {
              let updatedUser = _.cloneDeep(user);
              updatedUser.details = this.moveRecipyInCalendar(
                updatedUser.details!,
                action.recipy,
                action.previousEntry,
                action.newEntry
              );
              return new UpdateUserAction(updatedUser);
            } else return new ErrorAction('no user');
          })
        )
      )
    )
  );

  updateDayOnRemoveRecipy(
    day: IDayDetails,
    mealtime: MealTime,
    recipyId: string
  ): IDayDetails {
    let updatedDay: IDayDetails = _.cloneDeep(day);
    switch (mealtime) {
      case MealTime.Breakfast:
        updatedDay.breakfast = updatedDay.breakfast.filter(
          (item) => item.recipyId !== recipyId
        );
        break;
      case MealTime.Lunch:
        updatedDay.lunch = updatedDay.lunch.filter(
          (item) => item.recipyId !== recipyId
        );
        break;
      case MealTime.Dinner:
        updatedDay.dinner = updatedDay.dinner.filter(
          (item) => item.recipyId !== recipyId
        );
        break;
    }
    return updatedDay;
  }
  updateDayOnAddRecipy(
    day: IDayDetails,
    mealtime: MealTime,
    recipy: CalendarRecipyInDatabase,
    order: number
  ): IDayDetails {
    let updatedDay: IDayDetails = _.cloneDeep(day);
    switch (mealtime) {
      case MealTime.Breakfast:
        updatedDay.breakfast?.length
          ? updatedDay.breakfast.splice(order, 0, recipy)
          : (updatedDay.breakfast = [recipy]);
        break;
      case MealTime.Lunch:
        updatedDay.lunch?.length
          ? updatedDay.lunch.splice(order, 0, recipy)
          : (updatedDay.lunch = [recipy]);
        break;
      case MealTime.Dinner:
        updatedDay.dinner?.length
          ? updatedDay.dinner.splice(order, 0, recipy)
          : (updatedDay.dinner = [recipy]);
        break;
    }
    return updatedDay;
  }

  moveRecipyInCalendar(
    calendar: IDayDetails[],
    recipy: CalendarRecipyInDatabase,
    previousEntry: {
      day: string;
      mealtime: MealTime;
    },
    newEntry: {
      day: string;
      mealtime: MealTime;
      order: number;
    }
  ): IDayDetails[] {
    let calWithRemoved = calendar.map((day) => {
      if (day.day == previousEntry.day) {
        return this.updateDayOnRemoveRecipy(
          day,
          previousEntry.mealtime,
          recipy.recipyId
        );
      } else return day;
    });
    let calWithAdded = calWithRemoved.map((day) => {
      if (day.day == newEntry.day) {
        return this.updateDayOnAddRecipy(
          day,
          newEntry.mealtime,
          recipy,
          newEntry.order
        );
      } else return day;
    });
    return calWithAdded;
  }

  constructor(private actions$: Actions, private store: Store<IAppState>) {}
}
