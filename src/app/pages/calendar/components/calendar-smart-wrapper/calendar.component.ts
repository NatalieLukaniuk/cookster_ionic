import { Observable, combineLatest, map } from 'rxjs';
import { Component } from '@angular/core';
import { CalendarComment, CalendarRecipyInDatabase_Reworked, RecipyForCalendar_Reworked } from '../../../../models/calendar.models';
import { select, Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { Recipy } from 'src/app/models/recipies.models';
import { getCurrentDayRecipies, getRecipyPrepStart, getRecipyTimeOfPrepInMinutes, iSameDay, isDateAfter, isDateBefore, MS_IN_MINUTE, sortCommentsByDate, sortRecipiesByDate } from '../../calendar.utils';
import { CalendarReworkedService } from '../../calendar-reworked.service';

@Component({
    selector: 'app-calendar-wrapper',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
    standalone: false
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
      let commentsToDisplay: CalendarComment[] = plannedComments.filter(entry => iSameDay(new Date(entry.date), new Date(selectedDate)));
      return commentsToDisplay.sort((a, b) => sortCommentsByDate(a, b))
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

      const currentDayRecipies: RecipyForCalendar_Reworked[] = getCurrentDayRecipies(plannedRecipies, selectedDate, allRecipies);
      recipiesoDisplay = recipiesoDisplay.concat(currentDayRecipies);

      this.calendarService.setCurrentDayRecipies(recipiesoDisplay)

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
      return recipiesoDisplay.sort((a, b) => sortRecipiesByDate(a, b))
    })
  )

  getOverflowingRecipies(plannedRecipies: CalendarRecipyInDatabase_Reworked[], selectedDate: string, allRecipies: Recipy[]) {
    if (plannedRecipies.length && allRecipies.length) {

      const overflowing = plannedRecipies.map(recipy => {
        const found = allRecipies.find(r => r.id === recipy.recipyId)
        if (found) {
          return {
            ...recipy,
            prepStart: getRecipyPrepStart(found, recipy.endTime)
          }
        }
        return recipy
      }).filter(recipy => {
        return !iSameDay(new Date(recipy.endTime), new Date(recipy.prepStart!)) && (iSameDay(new Date(selectedDate), new Date(recipy.prepStart!)) ||
          (isDateAfter(new Date(selectedDate), new Date(recipy.prepStart!)) && isDateBefore(new Date(selectedDate), new Date(recipy.endTime))))
      })
      return overflowing
    }
    return []
  }


}
