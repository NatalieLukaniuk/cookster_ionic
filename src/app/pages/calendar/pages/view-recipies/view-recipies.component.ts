import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../../calendar.service';
import { Observable } from 'rxjs';
import { RecipyForCalendar_Reworked } from 'src/app/calendar/calendar.models';
import { select, Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

@Component({
  selector: 'app-view-recipies',
  templateUrl: './view-recipies.component.html',
  styleUrls: ['./view-recipies.component.scss'],
})
export class ViewRecipiesComponent implements OnInit {
  openedRecipies$: Observable<RecipyForCalendar_Reworked[]> = this.calendarService.getOpenedRecipies();

  displayRecipyIndex = 0;

  user$ = this.store.pipe(select(getCurrentUser));

  constructor(private calendarService: CalendarService, private store: Store<IAppState>) { }

  ngOnInit() {

  }

  onPortionsChanged(event: any) {
    //TODO save new portions and amount values
  }

  onSelectedRecipyChanged(event: any) {
    this.displayRecipyIndex = +event.detail.value
  }

}
