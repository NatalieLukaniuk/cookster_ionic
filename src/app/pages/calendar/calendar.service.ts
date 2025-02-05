import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RecipyForCalendar_Reworked } from 'src/app/models/calendar.models';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private openedRecipies$: BehaviorSubject<RecipyForCalendar_Reworked[]> = new BehaviorSubject([] as RecipyForCalendar_Reworked[])

  getOpenedRecipies() {
    return this.openedRecipies$.asObservable()
  }

  openRecipy(recipy: RecipyForCalendar_Reworked) {
    const current = this.openedRecipies$.getValue();
    if (!!current.find(openedRecipy => new Date(openedRecipy.endTime).getDate() === new Date(recipy.endTime).getDate() && openedRecipy.id === recipy.id)) {
      return
    }

    const updated = current.concat(recipy);
    this.openedRecipies$.next(updated);

  }

  closeRecipy(index: number) {
    const current = this.openedRecipies$.getValue();
    const updated = current.filter((openedRecipy, openedIndex) => openedIndex !== index);
    this.openedRecipies$.next(updated);
  }

  updateOpenedRecipies(changedRecipy: RecipyForCalendar_Reworked, updatedRecipy: RecipyForCalendar_Reworked) {
    const current = this.openedRecipies$.getValue();
    if (current.find(openedRecipy => new Date(openedRecipy.endTime).getDate() === new Date(changedRecipy.endTime).getDate() && openedRecipy.id === changedRecipy.id)) {
      const updated = current.map(openedRecipy => {
        if (new Date(openedRecipy.endTime).getDate() === new Date(changedRecipy.endTime).getDate() && openedRecipy.id === changedRecipy.id) {
          return updatedRecipy
        } else {
          return openedRecipy
        }
      })
      this.openedRecipies$.next(updated);
    }

  }
}
