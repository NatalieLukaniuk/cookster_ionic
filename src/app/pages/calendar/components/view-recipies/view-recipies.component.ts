import { Component, computed, effect, inject, signal } from '@angular/core';
import { CalendarService } from '../../calendar.service';
import { RecipyForCalendar_Reworked } from 'src/app/models/calendar.models';
import { select, Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/reducers';
import { DialogsService } from 'src/app/services/dialogs.service';
import { UpdateRecipyInCalendarActionNew } from 'src/app/store/actions/calendar.actions';

@Component({
  selector: 'app-view-recipies',
  templateUrl: './view-recipies.component.html',
  styleUrls: ['./view-recipies.component.scss'],
})
export class ViewRecipiesComponent {
  calendarService = inject(CalendarService);
  $openedRecipies = this.calendarService.getOpenedRecipies;

  $openedRecipy = computed(() => this.$openedRecipies()[this.displayRecipyIndex()])

  displayRecipyIndex = signal(0);

  constructor(private store: Store<IAppState>, private dialog: DialogsService,) {
    effect(() => {
      this.displayRecipyIndex.set(this.$openedRecipies().length - 1)
    })
  }


  onPortionsChanged(event: { portions: number, amountPerPortion: number }, changedRecipy: RecipyForCalendar_Reworked) {
    this.store.dispatch(new UpdateRecipyInCalendarActionNew(changedRecipy, { ...changedRecipy, ...event }))
  }

  onSelectedRecipyChanged(event: any) {
    this.displayRecipyIndex.set(+event.detail.value);
  }

  onSegmentBtnClicked(i: number) {
    if (i === this.displayRecipyIndex()) {
      this.dialog
        .openConfirmationDialog(
          `Закрити вкладку?`,
          ''
        )
        .then((res) => {
          if (res.role === 'confirm') {
            this.calendarService.closeRecipy(i);
            if (this.displayRecipyIndex() !== 0) {
              this.displayRecipyIndex.update(val => val - 1);
            }
          }
        });
    }
  }

}
