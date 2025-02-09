import { Recipy } from "../../models/recipies.models";
import * as moment from 'moment';
import { CalendarComment, CalendarRecipyInDatabase_Reworked, RecipyForCalendar_Reworked } from "../../models/calendar.models";

const MS_IN_HOUR = 3600000;
const MS_IN_DAY = 86400000;
export const MS_IN_MINUTE = 60000;

export const MINUTES_IN_DAY = 1440;

export function getFormattedName(name: string): string {
  // format is 'DDMMYYYY'
  return moment(name, 'DDMMYYYY').toString();
}

export function transformDate(date: Date): string {
  return (
    getTwoDigitValue(date.getDate().toString()) +
    getTwoDigitValue((date.getMonth() + 1).toString()) +
    date.getFullYear().toString()
  );
}

export function transfromMomentToDate(date: string){
  return moment(date, 'DDMMYYYY').format('YYYY-MM-DD')
}

export function getTwoDigitValue(value: string): string {
  if (value.length < 2) {
    return '0' + value;
  } else return value;
}

export const convertMsToHours = (amountInMs: number) => amountInMs / MS_IN_HOUR;

export const convertMsToDays = (amountInMs: number) => amountInMs / MS_IN_DAY;
export const convertMsToMinutes = (amountInMs: number) => amountInMs / MS_IN_MINUTE;

export const getRecipyTimeOfPrepInMinutes = (recipy: Recipy): number => {
    let time = 0;
    for (let step of recipy.steps) {
        time = time + +step.timeActive + +step.timePassive;
    }
    return time;
}

export const isDateBefore = (dayToCheck: Date, dayToCheckAgainst: Date) => {
    return !iSameDay(dayToCheck, dayToCheckAgainst) && (Date.parse(dayToCheckAgainst.toString()) - Date.parse(dayToCheck.toString())) > 0;
}

export const isDateAfter = (dayToCheck: Date, dayToCheckAgainst: Date) => {
    return !iSameDay(dayToCheck, dayToCheckAgainst) && (Date.parse(dayToCheck.toString()) - Date.parse(dayToCheckAgainst.toString())) > 0;
}

export const iSameDay = (dayToCheck: Date, dayToCheckAgainst: Date) =>
    dayToCheck.getFullYear() === dayToCheckAgainst.getFullYear() &&
    dayToCheck.getMonth() === dayToCheckAgainst.getMonth() &&
    dayToCheck.getDate() === dayToCheckAgainst.getDate()

    export const getLastPreparedDate = (recipyId: string, allPlannedRecipies: CalendarRecipyInDatabase_Reworked[]): null | Date => {
      let lastDate: Date | null = null;
      const allPlanned = allPlannedRecipies.filter(plannedRecipy => plannedRecipy.recipyId === recipyId);
      allPlanned.forEach(foundRecipy => {
        if(!lastDate || isDateAfter(new Date(foundRecipy.endTime), lastDate)){
          lastDate = new Date(foundRecipy.endTime)
        }
        })
      return lastDate
    }
  
    export const getIsNewer = (dateToCheck: Date, dateToCheckAgainst: Date) => {
      return dateToCheck.valueOf() > dateToCheckAgainst.valueOf()
    }

    export const sortRecipiesByDate = (a: RecipyForCalendar_Reworked, b: RecipyForCalendar_Reworked) => {
      if (getIsNewer(new Date(a.endTime), new Date(b.endTime))) {
        return 1
      } else {
        return -1
      }
    }

    export const sortCommentsByDate = (a: CalendarComment, b: CalendarComment) => {
      if (getIsNewer(new Date(a.date), new Date(b.date))) {
        return 1
      } else {
        return -1
      }
    }


