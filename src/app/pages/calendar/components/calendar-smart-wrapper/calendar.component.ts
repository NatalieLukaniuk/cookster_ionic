import { Observable, combineLatest, map } from 'rxjs';
import { Component } from '@angular/core';
import { CalendarComment, CalendarRecipyInDatabase_Reworked, RecipyForCalendar_Reworked } from '../../../../models/calendar.models';
import { select, Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { Recipy } from 'src/app/models/recipies.models';
import { getRecipyTimeOfPrepInMinutes, iSameDay, isDateAfter, isDateBefore, MS_IN_MINUTE } from '../../calendar.utils';
import { CalendarReworkedService } from '../../calendar-reworked.service';

@Component({
  selector: 'app-calendar-wrapper',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {

  constructor(private store: Store<IAppState>, private calendarService: CalendarReworkedService) { }
  currentDay$ = this.calendarService.getCurrentDay();

  plannedRecipies$: Observable<CalendarRecipyInDatabase_Reworked[]> = this.store.pipe(select(getCurrentUser), map(res => res?.plannedRecipies || []));

  plannedComments$: Observable<CalendarComment[]> = this.store.pipe(select(getCurrentUser), map(res => res?.plannedComments || []));

  allRecipies$ = this.store.pipe(select(getAllRecipies))

  currentDayComments$ = combineLatest([
    this.currentDay$,
    this.plannedComments$
  ]).pipe(
    map(res => {
      const [currentDay, plannedComments] = res;

      const selectedDate = currentDay.toDate().toDateString();
      let commentsToDisplay: CalendarComment[] = plannedComments.filter(entry => iSameDay(new Date(entry.date), new Date(selectedDate)) );
      return commentsToDisplay
    })
  )

  currentDateDetails$: Observable<RecipyForCalendar_Reworked[]> = combineLatest([
    this.currentDay$,
    this.plannedRecipies$,
    this.allRecipies$
  ]).pipe(
    map(res => {

      const [currentDay, plannedRecipies, allRecipies] = res;

      const selectedDate = currentDay.toDate().toDateString();
      let recipiesoDisplay: RecipyForCalendar_Reworked[] = [];

      const currentDayRecipies: RecipyForCalendar_Reworked[] = this.getCurrentDayRecipies(plannedRecipies, selectedDate, allRecipies);
      recipiesoDisplay = recipiesoDisplay.concat(currentDayRecipies);

      const overflowingRecipies: CalendarRecipyInDatabase_Reworked[] = this.getOverflowingRecipies(plannedRecipies, selectedDate, allRecipies);
      if (overflowingRecipies.length) {
        const mapped: RecipyForCalendar_Reworked[] = overflowingRecipies.map(recipy => {
          const found = allRecipies.find(r => r.id === recipy.recipyId);
          if (found) {
            return {
              ...found,
              ...recipy
            }
          } else return { ...allRecipies[0], ...recipy }
        });
        recipiesoDisplay = recipiesoDisplay.concat(mapped)
      }
      return recipiesoDisplay
    })
  )

  getOverflowingRecipies(plannedRecipies: CalendarRecipyInDatabase_Reworked[], selectedDate: string, allRecipies: Recipy[]) {
    if (plannedRecipies.length && allRecipies.length) {

      const overflowing = plannedRecipies.map(recipy => {
        const found = allRecipies.find(r => r.id === recipy.recipyId)
        if (found) {
          return {
            ...recipy,
            overflowStart: this.getRecipyPrepStart(found, recipy.endTime)
          }
        }
        return recipy
      }).filter(recipy => {
        return !iSameDay(new Date(recipy.endTime), new Date(recipy.overflowStart!)) && (iSameDay(new Date(selectedDate), new Date(recipy.overflowStart!)) ||
          (isDateAfter(new Date(selectedDate), new Date(recipy.overflowStart!)) && isDateBefore(new Date(selectedDate), new Date(recipy.endTime))))
      })
      return overflowing
    }
    return []
  }

  getRecipyPrepStart(recipy: Recipy, endTime: Date) {
    const recipyTimeInMs = getRecipyTimeOfPrepInMinutes(recipy) * MS_IN_MINUTE;
    const start = Date.parse(endTime.toString()) - recipyTimeInMs;
    return new Date(start)
  }


  getCurrentDayRecipies(plannedRecipies: CalendarRecipyInDatabase_Reworked[], selectedDate: string, allRecipies: Recipy[]) {
    const currentDayRecipies = plannedRecipies.filter(recipy => new Date(recipy.endTime).toDateString() === selectedDate);
    const currentDayRecipiesFullData: RecipyForCalendar_Reworked[] = currentDayRecipies.map(recipy => {
      const found = allRecipies.find(item => item.id === recipy.recipyId);
      if (found) {
        return { ...found, ...recipy }
      } else return { ...allRecipies[0], ...recipy }
    })
    return currentDayRecipiesFullData
  }

}
