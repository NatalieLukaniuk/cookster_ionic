import { Action } from '@ngrx/store';
import { RecipyForCalendar_Reworked } from 'src/app/calendar/calendar.models';
import {
  CalendarRecipyInDatabase,
  Day,
  MealTime,
} from 'src/app/models/calendar.models';
import { Recipy } from 'src/app/models/recipies.models';

export enum CalendarActionTypes {
  SET_RECIPY_SELECTED = '[CALENDAR] Set Recipy Selected',
  SET_DAY_SELECTED = '[CALENDAR] Set Day Selected',
  RESET_CALENDAR_STATE = '[CALENDAR] Reset Calendar State',
  SET_ADD_TO_CART_DATE_RANGE = '[CALENDAR] Set Add To Cart Range Selected',
  RESET_ADD_TO_CART_DATE_RANGE = '[CALENDAR] Add To Cart Range Reset',
  PREVIEW_RECIPY = '[CLANEDAR] Preview Recipy',
  RESET_PREVIEW_RECIPY = '[CLANEDAR] Reset Preview Recipy',
  LOAD_CALENDAR = '[CLANEDAR] Load Calendar',
  REMOVE_RECIPY_FROM_CALENDAR = '[CLANEDAR] Remove Recipy From Calendar',
  ADD_RECIPY_TO_CALENDAR = '[CLANEDAR] Add Recipy To Calendar',
  MOVE_RECIPY_IN_CALENDAR = '[CLANEDAR] Move Recipy In Calendar',
  UPDATE_RECIPY_IN_CALENDAR = '[CLANEDAR] Update Recipy In Calendar',
  ADD_COMMENT_TO_CALENDAR = '[CALENDAR] Add Comment To Calendar',
  REMOVE_COMMENT_FROM_CALENDAR = '[CLANEDAR] Remove Comment From Calendar',
  ADD_RECIPY_TO_CALENDAR_NEW = '[CALENDAR] Add Recipy To Calendar',
  UPDATE_RECIPY_IN_CALENDAR_NEW = '[CALENDAR] Update Recipy In Calendar',
  REMOVE_RECIPY_FROM_CALENDAR_NEW = '[CALENDAR] Remove Recipy From Calendar',
}

export class RemoveCommentFromCalendarAction implements Action {
  readonly type = CalendarActionTypes.REMOVE_COMMENT_FROM_CALENDAR;
  constructor(
    public comment: string,
    public day: string,
    public mealtime: MealTime
  ) {}
}

export class AddCommentToCalendarAction implements Action {
  readonly type = CalendarActionTypes.ADD_COMMENT_TO_CALENDAR;
  constructor(
    public comment: string,
    public day: string,
    public mealtime: MealTime,
    public order: number
  ) {}
}

export class UpdateRecipyInCalendarActionNew implements Action {
  readonly type = CalendarActionTypes.UPDATE_RECIPY_IN_CALENDAR_NEW;
  constructor(
    public previousEntry: RecipyForCalendar_Reworked,
    public newEntry: RecipyForCalendar_Reworked    
  ) {}
}

export class RemoveRecipyFromCalendarActionNew implements Action {
  readonly type = CalendarActionTypes.REMOVE_RECIPY_FROM_CALENDAR_NEW;
  constructor(
    public recipyEntry: RecipyForCalendar_Reworked
  ) {}
}

export class AddRecipyToCalendarActionNew implements Action {
  readonly type = CalendarActionTypes.ADD_RECIPY_TO_CALENDAR_NEW;
  constructor(
    public recipyEntry: RecipyForCalendar_Reworked
  ) {}
}

export class MoveRecipyInCalendarAction implements Action {
  readonly type = CalendarActionTypes.MOVE_RECIPY_IN_CALENDAR;
  constructor(
    public recipyId: string,
    public previousEntry: {
      day: string;
      mealtime: MealTime;
    },
    public newEntry: {
      day: string;
      mealtime: MealTime;
      order: number;
    }
  ) {}
}

export class UpdateRecipyInCalendarAction implements Action {
  readonly type = CalendarActionTypes.UPDATE_RECIPY_IN_CALENDAR;
  constructor(
    public recipyId: string,
    public day: string,
    public mealtime: MealTime,
    public portions: number,
    public amountPerPortion: number
  ) {}
}

export class AddRecipyToCalendarAction implements Action {
  readonly type = CalendarActionTypes.ADD_RECIPY_TO_CALENDAR;
  constructor(
    public recipyId: string,
    public day: string,
    public mealtime: MealTime,
    public portions: number,
    public amountPerPortion: number,
    public order: number
  ) {}
}
export class RemoveRecipyFromCalendarAction implements Action {
  readonly type = CalendarActionTypes.REMOVE_RECIPY_FROM_CALENDAR;
  constructor(
    public recipyId: string,
    public day: string,
    public mealtime: MealTime
  ) {}
}

export class LoadCalendarAction implements Action {
  readonly type = CalendarActionTypes.LOAD_CALENDAR;
  constructor(public calendar: Day[]) {}
}

export class PreviewRecipyAction implements Action {
  readonly type = CalendarActionTypes.PREVIEW_RECIPY;
  constructor(
    public recipy: Recipy,
    public portions: number,
    public amountPerPortion: number
  ) {}
}

export class ResetPreviewRecipyAction implements Action {
  readonly type = CalendarActionTypes.RESET_PREVIEW_RECIPY;
  constructor() {}
}
export class AddToCartRangeResetAction implements Action {
  readonly type = CalendarActionTypes.RESET_ADD_TO_CART_DATE_RANGE;
  constructor() {}
}
export class SetAddToCartRangeSelected implements Action {
  readonly type = CalendarActionTypes.SET_ADD_TO_CART_DATE_RANGE;
  constructor(public date: { startDate: string; endDate: string }) {}
}

export class SetRecipySelectedAction implements Action {
  readonly type = CalendarActionTypes.SET_RECIPY_SELECTED;
  constructor(public recipy: Recipy) {}
}

export class SetDaySelectedAction implements Action {
  readonly type = CalendarActionTypes.SET_DAY_SELECTED;
  constructor(public date: { day: Day; meal: string }) {}
}

export class ResetCalendarStateAction implements Action {
  readonly type = CalendarActionTypes.RESET_CALENDAR_STATE;
  constructor() {}
}

export type CalendarActions =
  | SetDaySelectedAction
  | SetRecipySelectedAction
  | ResetCalendarStateAction
  | SetAddToCartRangeSelected
  | AddToCartRangeResetAction
  | PreviewRecipyAction
  | ResetPreviewRecipyAction
  | LoadCalendarAction
  | RemoveRecipyFromCalendarAction
  | AddRecipyToCalendarAction
  | MoveRecipyInCalendarAction
  | UpdateRecipyInCalendarAction | AddCommentToCalendarAction | RemoveCommentFromCalendarAction
  | AddRecipyToCalendarActionNew
  | UpdateRecipyInCalendarActionNew | RemoveRecipyFromCalendarActionNew;
