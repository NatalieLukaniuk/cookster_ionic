import { Component, computed, inject } from '@angular/core';
import { CalendarComment, CalendarRecipyInDatabase_Reworked, RecipyForCalendar_Reworked } from '../../../../models/calendar.models';

import { Recipy } from 'src/app/models/recipies.models';
import { getCurrentDayRecipies, getRecipyPrepStart, iSameDay, isDateAfter, isDateBefore, sortCommentsByDate, sortRecipiesByDate } from '../../calendar.utils';
import { CalendarReworkedService } from '../../calendar-reworked.service';
import { RecipiesService } from 'src/app/services/recipies.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-calendar-wrapper',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  recipiesService = inject(RecipiesService);
  userDataService = inject(UserDataService);
  calendarService = inject(CalendarReworkedService);

  $recipies = this.recipiesService.getRecipies;
  $currentDay = this.calendarService.getCurrentDay;
  $plannedRecipies = this.userDataService.userPlannedRecipies;
  $plannedComments = this.userDataService.userPlannedComments;

  $currentDayComments = computed(() => {
    const [currentDay, plannedComments] = [this.$currentDay(), this.$plannedComments()];

      const selectedDate = currentDay.toDate().toDateString();
      let commentsToDisplay: CalendarComment[] = plannedComments.filter(entry => iSameDay(new Date(entry.date), new Date(selectedDate)));
      return commentsToDisplay.sort((a, b) => sortCommentsByDate(a, b))
  }) 

  $currentDateDetails = computed(() => {
    const [currentDay, plannedRecipies] = [this.$currentDay(), this.$plannedRecipies()];

      const selectedDate = currentDay.toDate().toDateString();
      let recipiesoDisplay: RecipyForCalendar_Reworked[] = [];

      const currentDayRecipies: RecipyForCalendar_Reworked[] = getCurrentDayRecipies(plannedRecipies, selectedDate, this.$recipies());
      recipiesoDisplay = recipiesoDisplay.concat(currentDayRecipies);

      this.calendarService.setCurrentDayRecipies(recipiesoDisplay)

      const overflowingRecipies: CalendarRecipyInDatabase_Reworked[] = this.getOverflowingRecipies(plannedRecipies, selectedDate, this.$recipies());
      if (overflowingRecipies.length) {
        const mapped: RecipyForCalendar_Reworked[] = overflowingRecipies.map(recipy => {
          const found = this.$recipies().find(r => r.id === recipy.recipyId);
          if (found) {
            return {
              ...found,
              ...recipy
            }
          } else return { ...this.$recipies()[0], ...recipy }
        });
        recipiesoDisplay = recipiesoDisplay.concat(mapped)
      }
      return recipiesoDisplay.sort((a, b) => sortRecipiesByDate(a, b))
  })

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
