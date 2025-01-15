import { Recipy } from "../models/recipies.models";

export interface CalendarRecipyInDatabase_Reworked {
    recipyId: string;
    portions: number;
    amountPerPortion: number;
    endTime: Date;
    overflowStart?: Date

  }

  export interface CalendarComment {
    comment: string, date: Date, isReminder: boolean
  }
  
  export const mockPlannedRecipies: CalendarRecipyInDatabase_Reworked[] = [
    {
      recipyId: '-NmQ6PGasvqnMJZbz-mz',
      portions: 2,
      amountPerPortion: 350,
      endTime: new Date('2024-09-03T19:20:00')
    },
    {
      recipyId: '-O57rNh1mVadL70jMZ1Z',
      portions: 2,
      amountPerPortion: 350,
      endTime: new Date('2024-09-03T12:00:00')
    },
    {
        recipyId: '-NmQ6PGasvqnMJZbz-mz',
        portions: 2,
        amountPerPortion: 350,
        endTime: new Date('2024-09-03T19:00:00')
      },
      {
        recipyId: '-O57rNh1mVadL70jMZ1Z',
        portions: 2,
        amountPerPortion: 350,
        endTime: new Date('2024-09-03T12:00:00')
      },
      {
        recipyId: '-NmQ6PGasvqnMJZbz-mz',
        portions: 2,
        amountPerPortion: 350,
        endTime: new Date('2024-09-03T21:24:00')
      },
      {
        recipyId: '-O57rNh1mVadL70jMZ1Z',
        portions: 2,
        amountPerPortion: 350,
        endTime: new Date('2024-09-03T12:24:00')
      },
    {
        recipyId: '-O57rNh1mVadL70jMZ1Z',
        portions: 2,
        amountPerPortion: 350,
        endTime: new Date('2024-09-04T12:24:00')
      },
      {
        recipyId: '-O57rNh1mVadL70jMZ1Z',
        portions: 2,
        amountPerPortion: 350,
        endTime: new Date('2024-09-05T12:24:00')
      },
  ]
  

  export interface RecipyForCalendar_Reworked extends Recipy {
    portions: number;
    amountPerPortion: number;
    endTime: Date;
    overflowStart?: Date
  }