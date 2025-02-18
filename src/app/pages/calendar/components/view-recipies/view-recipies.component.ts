import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../../calendar.service';
import { Observable, tap } from 'rxjs';
import { RecipyForCalendar_Reworked } from 'src/app/models/calendar.models';
import { select, Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { DialogsService } from 'src/app/services/dialogs.service';
import { UpdateRecipyInCalendarActionNew } from 'src/app/store/actions/calendar.actions';

@Component({
  selector: 'app-view-recipies',
  templateUrl: './view-recipies.component.html',
  styleUrls: ['./view-recipies.component.scss'],
})
export class ViewRecipiesComponent implements OnInit {
  openedRecipies$: Observable<RecipyForCalendar_Reworked[]> = this.calendarService.getOpenedRecipies().pipe(tap(openedRecipies => {
    this.displayRecipyIndex = openedRecipies.length - 1
  }));

  displayRecipyIndex = 0;

  user$ = this.store.pipe(select(getCurrentUser));

  constructor(private calendarService: CalendarService, private store: Store<IAppState>, private dialog: DialogsService,) { }

  ngOnInit() {

  }

  onPortionsChanged(event: {portions: number, amountPerPortion: number}, changedRecipy: RecipyForCalendar_Reworked) {
    this.store.dispatch(new UpdateRecipyInCalendarActionNew(changedRecipy, {...changedRecipy, ...event}))
  }

  onSelectedRecipyChanged(event: any) {
    this.displayRecipyIndex = +event.detail.value;
  }

  onSegmentBtnClicked(i: number) {
    if (i === this.displayRecipyIndex) {
      this.dialog
        .openConfirmationDialog(
          `Закрити вкладку?`,
          ''
        )
        .then((res) => {
          if (res.role === 'confirm') {
            this.calendarService.closeRecipy(i);
            if (this.displayRecipyIndex !== 0) {
              this.displayRecipyIndex -= this.displayRecipyIndex;
            }
          }
        });
    }
  }

}
