import { Recipy } from "../models/recipies.models";

const MS_IN_HOUR = 3600000;
const MS_IN_DAY = 86400000;
export const MS_IN_MINUTE = 60000;

export const MINUTES_IN_DAY = 1440;

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