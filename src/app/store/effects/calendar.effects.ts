import { UpdateRecipyInCalendarAction, AddCommentToCalendarAction, RemoveCommentFromCalendarAction, AddRecipyToCalendarActionNew, UpdateRecipyInCalendarActionNew, RemoveRecipyFromCalendarActionNew } from './../actions/calendar.actions';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { map, switchMap, take } from 'rxjs/operators';
import {
  CalendarRecipyInDatabase,
  DayDetails,
  IDayDetails,
  MealTime,
} from 'src/app/models/calendar.models';

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
import { User } from 'src/app/models/auth.models';
import { CalendarRecipyInDatabase_Reworked } from 'src/app/calendar/calendar.models';

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
              updatedUser.details = updatedUser.details!.map(
                (day: IDayDetails) => {
                  if (day.day == action.day) {
                    day = this.updateDayOnRemoveRecipy(
                      day,
                      action.mealtime,
                      action.recipyId
                    );
                    return day;
                  } else return day;
                }
              );
              return new UpdateUserAction(
                updatedUser,
                `${action.recipyId} видалено`
              );
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
              if (updatedUser.details?.find((day) => day.day == action.day)) {
                updatedUser.details = updatedUser.details!.map(
                  (day: IDayDetails) => {
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
                  }
                );
              } else {
                let newDay = new DayDetails(action.day, []);
                newDay = this.updateDayOnAddRecipy(
                  newDay,
                  action.mealtime,
                  {
                    recipyId: action.recipyId,
                    portions: action.portions,
                    amountPerPortion: action.amountPerPortion,
                  },
                  action.order
                );
                updatedUser.details?.push(newDay);
              }

              return new UpdateUserAction(
                updatedUser,
                `${action.recipyId} додано`
              );
            } else return new ErrorAction('no user');
          })
        )
      )
    )
  );

  addCommentToCal$ = createEffect(() => this.actions$.pipe(
    ofType(CalendarActionTypes.ADD_COMMENT_TO_CALENDAR),
    switchMap((action: AddCommentToCalendarAction) => this.store.pipe(
      select(getCurrentUser),
      take(1),
      map((user: User | null) => {
        if (user && user.details) {
          let updatedUser = _.cloneDeep(user);
          let commentToAdd = {
            comment: action.comment, date: action.selectedDate, isReminder: action.isReminder
          }
          if (updatedUser.plannedComments) {
            updatedUser.plannedComments.push(commentToAdd)
          } else {
            updatedUser.plannedComments = [commentToAdd]
          }
          return new UpdateUserAction(
            updatedUser,
            `${action.comment} додано`
          );

        } else return new ErrorAction('no user');
      })
    ))
  ))

  deleteComment$ = createEffect(() => this.actions$.pipe(
    ofType(CalendarActionTypes.REMOVE_COMMENT_FROM_CALENDAR),
    switchMap((action: RemoveCommentFromCalendarAction) => this.store.pipe(
      select(getCurrentUser),
      take(1),
      map((user: User | null) => {
        if (user && user.details) {
          let updatedUser = _.cloneDeep(user);
          const foundDay = updatedUser.details?.find((day) => day.day == action.day);
          if (foundDay && foundDay.comments) {
            foundDay.comments = foundDay.comments.filter(commentItem => commentItem.comment !== action.comment || commentItem.mealTime !== action.mealtime);
          }
          return new UpdateUserAction(
            updatedUser,
            `${action.comment} видалено`
          );
        } else return new ErrorAction('no user');
      })
    ))
  ))

  updateRecipyInCalendar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CalendarActionTypes.UPDATE_RECIPY_IN_CALENDAR),
      switchMap((action: UpdateRecipyInCalendarAction) =>
        this.store.pipe(
          select(getCurrentUser),
          take(1),
          map((user: User | null) => {
            if (user && user.details) {
              let updatedUser = _.cloneDeep(user);
              updatedUser.details = updatedUser.details!.map(
                (day: IDayDetails) => {
                  if (day.day == action.day) {
                    day[action.mealtime] = day[action.mealtime].map(
                      (recipy: CalendarRecipyInDatabase) => {
                        if (recipy.recipyId === action.recipyId) {
                          return {
                            ...recipy,
                            portions: action.portions,
                            amountPerPortion: action.amountPerPortion,
                          };
                        } else return recipy;
                      }
                    );
                  }
                  return day;
                }
              );
              return new UpdateUserAction(
                updatedUser,
                `${action.recipyId} оновлено`
              );
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
                action.recipyId,
                action.previousEntry,
                action.newEntry
              );
              return new UpdateUserAction(
                updatedUser,
                `${action.recipyId} перенесено`
              );
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
    recipyId: string,
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
    let foundRecipy: CalendarRecipyInDatabase | undefined;
    let calWithRemoved = calendar.map((day) => {
      if (day.day == previousEntry.day) {
        foundRecipy = day[previousEntry.mealtime].find(recipy => recipy.recipyId === recipyId);
        return this.updateDayOnRemoveRecipy(
          day,
          previousEntry.mealtime,
          recipyId
        );
      } else return day;
    });
    const isDayExists = !!calWithRemoved.find(day => day.day == newEntry.day);
    let calWithAdded = calWithRemoved;
    if (isDayExists) {
      calWithAdded = calWithRemoved.map((day) => {
        if (day.day == newEntry.day && foundRecipy) {
          return this.updateDayOnAddRecipy(
            day,
            newEntry.mealtime,
            foundRecipy,
            newEntry.order
          );
        } else return day;
      });
    } else if (foundRecipy) {
      const newDay = new DayDetails(newEntry.day, []);
      newDay[newEntry.mealtime] = [foundRecipy];
      calWithAdded = calWithRemoved.concat([newDay])
    }
    return calWithAdded;
  }

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
                endTime: action.recipyEntry.endTime
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
                    endTime: action.newEntry.endTime
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
