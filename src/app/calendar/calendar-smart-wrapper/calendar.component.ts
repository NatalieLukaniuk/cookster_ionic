import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { CalendarRecipyInDatabase_Reworked, RecipyForCalendar_Reworked } from '../calendar.models';
import * as moment from 'moment';
import { select, Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';

@Component({
  selector: 'app-calendar-wrapper',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {

  currentDay$: BehaviorSubject<moment.Moment> = new BehaviorSubject(moment().clone());

  plannedRecipies$: Observable<CalendarRecipyInDatabase_Reworked[]> = this.store.pipe(select(getCurrentUser), map(res => res?.plannedRecipies || []));

  allRecipies$ = this.store.pipe(select(getAllRecipies))

  currentDateDetails$: Observable<RecipyForCalendar_Reworked[]> = combineLatest([
    this.currentDay$,
    this.plannedRecipies$,
    this.allRecipies$
  ]).pipe(
    map(res => {
      const selectedDate = res[0].toDate().toDateString();
      const currentDayRecipies = res[1].filter(recipy => recipy.endTime.toDateString() === selectedDate);
      const currentDayRecipiesFullData: RecipyForCalendar_Reworked[] = currentDayRecipies.map(recipy => {
        const found = res[2].find(item => item.id === recipy.recipyId);
        if (found) {
          return { ...found, ...recipy }
        } else return { ...res[2][0], ...recipy }
      })
      return currentDayRecipiesFullData
    })
  )

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
