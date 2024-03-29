import { MeasuringUnit, Recipy } from './recipies.models';
import * as moment from 'moment';

export interface CalendarRecipyInDatabase {
  recipyId: string;
  portions: number;
  amountPerPortion: number;
}

export enum MealTime {
  Breakfast = 'breakfast',
  Lunch = 'lunch',
  Dinner = 'dinner',
}

export interface Day {
  value: moment.Moment;
  active: boolean;
  selected: boolean;
  disabled: boolean;
  details: DayDetailsExtended;
  preps?: Reminder[];
}

export interface IDayDetails {
  breakfast: CalendarRecipyInDatabase[];
  lunch: CalendarRecipyInDatabase[];
  dinner: CalendarRecipyInDatabase[];
  comments: {comment: string, mealTime: string}[];
  day: string; // 2 digits of day, 2 digits of month, 4 digits of year
}

export class DayDetails implements IDayDetails {
  breakfast: CalendarRecipyInDatabase[] = [];
  lunch: CalendarRecipyInDatabase[] = [];
  dinner: CalendarRecipyInDatabase[] = [];
  constructor(public day: string, public comments: {comment: string, mealTime: string}[]) {
    this.day = day;
    this.comments = comments
  }
}

export interface DayDetailsExtended extends IDayDetails {
  breakfastRecipies: RecipyForCalendar[];
  lunchRecipies: RecipyForCalendar[];
  dinnerRecipies: RecipyForCalendar[];
  // day: string // 2 digits of day, 2 digits of month, 4 digits of year FIXME: check why is this commented, remove if not used
}

export interface RecipyForCalendar extends Recipy {
  portions: number;
  amountPerPortion: number;
}

export interface IReminderList {
  day: Date;
  reminders: Reminder[];
}

export interface Reminder {
  description: string;
  calendarDay: string;
  fullDate: Date;
  done?: boolean;
}

export function transformDate(date: Date): string {
  return (
    getTwoDigitValue(date.getDate().toString()) +
    getTwoDigitValue((date.getMonth() + 1).toString()) +
    date.getFullYear().toString()
  );
}
export function getTwoDigitValue(value: string): string {
  if (value.length < 2) {
    return '0' + value;
  } else return value;
}
