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
  preps?: SuggestionList;
}

export interface IDayDetails {
  breakfast: CalendarRecipyInDatabase[];
  lunch: CalendarRecipyInDatabase[];
  dinner: CalendarRecipyInDatabase[];
  day: string; // 2 digits of day, 2 digits of month, 4 digits of year
}

export class DayDetails implements IDayDetails {
  breakfast: CalendarRecipyInDatabase[] = [];
  lunch: CalendarRecipyInDatabase[] = [];
  dinner: CalendarRecipyInDatabase[] = [];
  constructor(public day: string) {
    this.day = day;
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

export interface ISuggestionList {
  date: string;
  day: Date;
  suggestions: Suggestion[];
}

export class SuggestionList implements ISuggestionList {
  date: string;
  day: Date;
  suggestions: Suggestion[] | SuggestionCard[];
  isExpanded: boolean;
  constructor(day: Date) {
    this.day = day;
    this.suggestions = [];
    this.date = transformDate(day);
    this.isExpanded = true;
  }
}

export interface Suggestion {
  ingredients: {
    productId: string;
    productName: string;
    amount: number;
    unit: MeasuringUnit;
  }[];
  prepDescription: string;
  recipyId: string;
  recipyTitle: string;
  day: moment.Moment;
  done?: boolean;
  time?: string;
}

export class SuggestionCard implements Suggestion {
  ingredients: {
    productId: string;
    productName: string;
    amount: number;
    unit: MeasuringUnit;
  }[];
  prepDescription: string;
  recipyId: string;
  recipyTitle: string;
  day: moment.Moment;
  done?: boolean = false;
  time?: string = '';
  constructor(suggestion: Suggestion) {
    this.ingredients = suggestion.ingredients;
    this.prepDescription = suggestion.prepDescription;
    this.recipyId = suggestion.recipyId;
    this.recipyTitle = suggestion.recipyTitle;
    this.day = suggestion.day;
    this.time = suggestion.time;
  }
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
