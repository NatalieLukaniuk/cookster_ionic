import { Recipy } from "./recipies.models";

export interface CalendarRecipyInDatabase_Reworked {
    recipyId: string;
    portions: number;
    amountPerPortion: number;
    endTime: Date;
    entryId: string;
    overflowStart?: Date

  }

  export interface CalendarComment {
    comment: string, date: Date, isReminder: boolean
  }

  export interface RecipyForCalendar_Reworked extends Recipy {
    portions: number;
    amountPerPortion: number;
    endTime: Date;
    entryId: string;
    overflowStart?: Date
  }