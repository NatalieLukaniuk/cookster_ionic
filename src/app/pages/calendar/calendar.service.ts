import { Injectable, signal } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { RecipyForCalendar_Reworked } from 'src/app/models/calendar.models';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(private router: Router) { }

  private openedRecipies = signal<RecipyForCalendar_Reworked[]>([])

  getOpenedRecipies = this.openedRecipies.asReadonly()


  openRecipy(recipy: RecipyForCalendar_Reworked) {

    const current = this.openedRecipies();
    if (!!current.find(openedRecipy => new Date(openedRecipy.endTime).getDate() === new Date(recipy.endTime).getDate() && openedRecipy.id === recipy.id)) {
      return
    }

    this.openedRecipies.update(value => value.concat(recipy));

  }

  closeRecipy(index: number) {
    const isAllClosed = this.openedRecipies().filter((openedRecipy, openedIndex) => openedIndex !== index).length > 0;
    if (isAllClosed) {
      this.router.navigate(['tabs', 'calendar'])
    }
    this.openedRecipies.update(value => value.filter((openedRecipy, openedIndex) => openedIndex !== index));
  }

  updateOpenedRecipies(changedRecipy: RecipyForCalendar_Reworked, updatedRecipy: RecipyForCalendar_Reworked) {

    if (this.openedRecipies().find(openedRecipy => new Date(openedRecipy.endTime).getDate() === new Date(changedRecipy.endTime).getDate() && openedRecipy.id === changedRecipy.id)) {

      this.openedRecipies.update(current => {
        return current.map(openedRecipy => {
          if (new Date(openedRecipy.endTime).getDate() === new Date(changedRecipy.endTime).getDate() && openedRecipy.id === changedRecipy.id) {
            return updatedRecipy
          } else {
            return openedRecipy
          }
        })
      });
    }
  }
}


@Injectable()
export class OpenedRecipiesGuardService {

  constructor(private calendarService: CalendarService, private router: Router, private route: ActivatedRoute) { }
  canActivate(): boolean {

    const isOpenedRecipies = !!this.calendarService.getOpenedRecipies().length;
    if (!isOpenedRecipies) {
      this.router.navigate(['tabs', 'calendar'])
    }
    return isOpenedRecipies
  }

}