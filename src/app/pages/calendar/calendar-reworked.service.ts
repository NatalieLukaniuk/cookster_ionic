import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { RecipyForCalendar_Reworked } from 'src/app/models/calendar.models';

@Injectable({
  providedIn: 'root'
})
export class CalendarReworkedService {
  private currentDay$: BehaviorSubject<moment.Moment> = new BehaviorSubject(moment().clone());
  private currentDayRecipies$: BehaviorSubject<RecipyForCalendar_Reworked[]> = new BehaviorSubject([] as RecipyForCalendar_Reworked[])

  getCurrentDay(){
    return this.currentDay$.asObservable()
  }

  getCurrentDayValue(){
    return this.currentDay$.getValue()
  }

  setCurrentDay(newValue: moment.Moment){
    this.currentDay$.next(newValue)
  }

  getCurrentDayRecipies(){
    return this.currentDayRecipies$.asObservable()
  }

  getCurrentDayRecipiesValue(){
    return this.currentDayRecipies$.getValue()
  }

  setCurrentDayRecipies(newValue: RecipyForCalendar_Reworked[]){
    this.currentDayRecipies$.next(newValue)
  }

  constructor() { }
}
