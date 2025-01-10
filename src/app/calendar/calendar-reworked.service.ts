import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarReworkedService {
  private currentDay$: BehaviorSubject<moment.Moment> = new BehaviorSubject(moment().clone());

  getCurrentDay(){
    return this.currentDay$.asObservable()
  }

  getCurrentDayValue(){
    return this.currentDay$.getValue()
  }

  setCurrentDay(newValue: moment.Moment){
    this.currentDay$.next(newValue)
  }
  constructor() { }
}
