import { CalendarRecipyInDatabase } from './../../models/calendar.models';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { CalendarRecipyInDatabase_Reworked, RecipyForCalendar_Reworked } from '../calendar.models';
import * as moment from 'moment';
import { select, Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { DayDetails } from 'src/app/models/calendar.models';
import { Recipy } from 'src/app/models/recipies.models';

@Component({
  selector: 'app-calendar-wrapper',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {

  currentDay$: BehaviorSubject<moment.Moment> = new BehaviorSubject(moment().clone());

  plannedRecipies$: Observable<CalendarRecipyInDatabase_Reworked[]> = this.store.pipe(select(getCurrentUser), map(res => res?.plannedRecipies || []));

  old_plannedRecipies$ = this.store.pipe(select(getCurrentUser), map(user => user?.details || []))

  allRecipies$ = this.store.pipe(select(getAllRecipies))

  currentDateDetails$: Observable<RecipyForCalendar_Reworked[]> = combineLatest([
    this.currentDay$,
    this.plannedRecipies$,
    this.allRecipies$,
    this.old_plannedRecipies$
  ]).pipe(
    map(res => {

      const [currentDay, plannedRecipies, allRecipies, oldPlannedRecipies] = res;

      const selectedDate = currentDay.toDate().toDateString();
      let recipiesoDisplay: RecipyForCalendar_Reworked[] = [];
      if (oldPlannedRecipies.length && allRecipies.length && selectedDate) {
        const mappedOld = this.mapOldPlannedRecipies(oldPlannedRecipies, currentDay, allRecipies);
        recipiesoDisplay = recipiesoDisplay.concat(mappedOld);
      }
      
      const currentDayRecipies = plannedRecipies.filter(recipy =>  new Date(recipy.endTime).toDateString() === selectedDate);
      const currentDayRecipiesFullData: RecipyForCalendar_Reworked[] = currentDayRecipies.map(recipy => {
        const found = allRecipies.find(item => item.id === recipy.recipyId);
        if (found) {
          return { ...found, ...recipy }
        } else return { ...allRecipies[0], ...recipy }
      })
      recipiesoDisplay = recipiesoDisplay.concat(currentDayRecipiesFullData);
      return recipiesoDisplay
    })
  )

  mapOldPlannedRecipies(oldPlannedRecipies: DayDetails[], selectedDate: moment.Moment, allRecipies: Recipy[]): RecipyForCalendar_Reworked[] {
    const selectedDayToMatch = selectedDate.clone().format('DDMMYYYY');
    const plannedForSelectedDate = oldPlannedRecipies.filter(recipy => recipy.day === selectedDayToMatch)
    let mapped: RecipyForCalendar_Reworked[] = [];
    if (plannedForSelectedDate.length) {
      plannedForSelectedDate.forEach((dayDetails: DayDetails) => {
        if (dayDetails.breakfast) {
          dayDetails.breakfast.forEach((recipy: CalendarRecipyInDatabase) => {
            const found = allRecipies.find(item => item.id === recipy.recipyId);
            if (found) {
              const dateTime = selectedDate.clone().toDate();
              dateTime.setHours(9, 0, 0, 0);
              const updated = { ...found, ...recipy, endTime: dateTime }
              mapped.push(updated)
            } 
          })
        }
        if (dayDetails.lunch) {
          dayDetails.lunch.forEach((recipy: CalendarRecipyInDatabase) => {
            const found = allRecipies.find(item => item.id === recipy.recipyId);
            if (found) {
              const dateTime = selectedDate.clone().toDate();
              dateTime.setHours(14, 0, 0, 0);
              const updated = { ...found, ...recipy, endTime: dateTime }
              mapped.push(updated)
            } 
          })
        }
        if (dayDetails.dinner) {
          dayDetails.dinner.forEach((recipy: CalendarRecipyInDatabase) => {
            const found = allRecipies.find(item => item.id === recipy.recipyId);
            if (found) {
              const dateTime = selectedDate.clone().toDate();
              dateTime.setHours(19, 0, 0, 0);
              const updated = { ...found, ...recipy, endTime: dateTime }
              mapped.push(updated)
            } 
          })
        }
      })
    }
    return mapped;
  }

  constructor(private store: Store<IAppState>,) { }

  ngOnInit() { }

  goPreviousDay() {
    const current = this.currentDay$.getValue();
    const updated = current.subtract(1, 'day');
    this.currentDay$.next(updated);
  }
  goNextDay() {
    const current = this.currentDay$.getValue();
    const updated = current.add(1, 'day');
    this.currentDay$.next(updated);
  }

}
