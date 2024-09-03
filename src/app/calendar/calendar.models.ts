import { Recipy } from "../models/recipies.models";

export interface CalendarRecipyInDatabase_Reworked {
    recipyId: string;
    portions: number;
    amountPerPortion: number;
    endTime: Date
  }
  
  export const mockPlannedRecipies: CalendarRecipyInDatabase_Reworked[] = [
    {
      recipyId: '-O5gg2YNlRduAeRaPg0w',
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
    endTime: Date
  }