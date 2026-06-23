import { Injectable, signal } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { RecipyForCalendar_Reworked } from 'src/app/models/calendar.models';

@Injectable({
  providedIn: 'root'
})
export class CalendarReworkedService {
  private currentDay = signal<moment.Moment>(moment().clone())
  private currentDayRecipies = signal<RecipyForCalendar_Reworked[]>([])

  getCurrentDay = this.currentDay.asReadonly()

  setCurrentDay(newValue: moment.Moment){
    this.currentDay.set(newValue)
  }

  getCurrentDayRecipies = this.currentDayRecipies.asReadonly()

  setCurrentDayRecipies(newValue: RecipyForCalendar_Reworked[]){
    this.currentDayRecipies.set(newValue)
  }

  
}
