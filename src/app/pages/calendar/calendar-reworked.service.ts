import { computed, inject, Injectable, signal } from '@angular/core';
import * as moment from 'moment';
import { RecipyForCalendar_Reworked } from 'src/app/models/calendar.models';
import { UserDataService } from 'src/app/services/user-data.service';
import { getCurrentDayRecipies } from './calendar.utils';
import { RecipiesService } from 'src/app/services/recipies.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarReworkedService {
  userDataService = inject(UserDataService);
  recipiesService = inject(RecipiesService)
  private currentDay = signal<moment.Moment>(moment().clone())

  $plannedRecipies = this.userDataService.userPlannedRecipies;
  $allRecipies = this.recipiesService.getRecipies;

  currentDayRecipies = computed(() => {
    const [currentDay, plannedRecipies] = [this.currentDay(), this.$plannedRecipies()];

    const selectedDate = currentDay.toDate().toDateString();
    const currentDayRecipies: RecipyForCalendar_Reworked[] = getCurrentDayRecipies(plannedRecipies, selectedDate, this.$allRecipies());
    return currentDayRecipies || []
  })

  getCurrentDay = this.currentDay.asReadonly()

  setCurrentDay(newValue: moment.Moment) {
    this.currentDay.set(newValue.clone())
  }


}
