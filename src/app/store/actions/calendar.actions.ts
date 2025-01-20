import { Action } from '@ngrx/store';
import { RecipyForCalendar_Reworked } from 'src/app/models/calendar.models';
import { Recipy } from 'src/app/models/recipies.models';

export enum CalendarActionTypes {
  SET_RECIPY_SELECTED = '[CALENDAR] Set Recipy Selected',
  RESET_CALENDAR_STATE = '[CALENDAR] Reset Calendar State',
  SET_ADD_TO_CART_DATE_RANGE = '[CALENDAR] Set Add To Cart Range Selected',
  RESET_ADD_TO_CART_DATE_RANGE = '[CALENDAR] Add To Cart Range Reset',
  PREVIEW_RECIPY = '[CLANEDAR] Preview Recipy',
  RESET_PREVIEW_RECIPY = '[CLANEDAR] Reset Preview Recipy',
  ADD_COMMENT_TO_CALENDAR = '[CALENDAR] Add Comment To Calendar',
  ADD_RECIPY_TO_CALENDAR_NEW = '[CALENDAR] Add Recipy To Calendar',
  UPDATE_RECIPY_IN_CALENDAR_NEW = '[CALENDAR] Update Recipy In Calendar',
  REMOVE_RECIPY_FROM_CALENDAR_NEW = '[CALENDAR] Remove Recipy From Calendar',
}

export class AddCommentToCalendarAction implements Action {
  readonly type = CalendarActionTypes.ADD_COMMENT_TO_CALENDAR;
  constructor(
    public comment: string,
    public selectedDate: Date,
    public isReminder: boolean
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


export class ResetCalendarStateAction implements Action {
  readonly type = CalendarActionTypes.RESET_CALENDAR_STATE;
  constructor() {}
}

export type CalendarActions =
  | SetRecipySelectedAction
  | ResetCalendarStateAction
  | SetAddToCartRangeSelected
  | AddToCartRangeResetAction
  | PreviewRecipyAction
  | ResetPreviewRecipyAction
  | AddCommentToCalendarAction 
  | AddRecipyToCalendarActionNew
  | UpdateRecipyInCalendarActionNew | RemoveRecipyFromCalendarActionNew;
