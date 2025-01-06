import { ModalController } from '@ionic/angular';
import { AddRecipyToCalendarModalComponent } from '../add-recipy-to-calendar-modal/add-recipy-to-calendar-modal.component';
import { RecipyForCalendar_Reworked } from './../calendar.models';
import { Component, Input, OnInit } from '@angular/core';
import { UpdateRecipyInCalendarActionNew } from 'src/app/store/actions/calendar.actions';
import { IAppState } from 'src/app/store/reducers';
import { Store } from '@ngrx/store';

const MINUTES_IN_PIXEL = 1;

const HOURS_IN_DAY = 24;

@Component({
  selector: 'app-calendar-timeline-day',
  templateUrl: './calendar-timeline-day.component.html',
  styleUrls: ['./calendar-timeline-day.component.scss'],
})
export class CalendarTimelineDayComponent implements OnInit {
  PIXELS_IN_DAY = (HOURS_IN_DAY * 60) / MINUTES_IN_PIXEL;

  @Input() recipies: RecipyForCalendar_Reworked[] | null = []

  timelineScaleItems = Array.from({ length: HOURS_IN_DAY }, (v, i) => i)

  constructor(
    private modalCtrl: ModalController,
    private store: Store<IAppState>,
  ) { }

  ngOnInit() { }

  getRecipyTopMargin(recipy: RecipyForCalendar_Reworked) {
    const minutesTillEndTime = (new Date(recipy.endTime).getHours() * 60) + new Date(recipy.endTime).getMinutes();
    const startTime = minutesTillEndTime - this.getRecipyHeight(recipy);
    if (startTime > 0) {
      return startTime / MINUTES_IN_PIXEL
    } else {
      return 0
    }
  }

  getRecipyHeight(recipy: RecipyForCalendar_Reworked): number {
    let time = 0;
    for (let step of recipy.steps) {
      time = time + +step.timeActive + +step.timePassive;
    }
    return time / MINUTES_IN_PIXEL;
  }

  async onEditRecipy(event: RecipyForCalendar_Reworked) {
    const modal = await this.modalCtrl.create({
      component: AddRecipyToCalendarModalComponent,
      componentProps: {
        selectedRecipy: event,
        selectedTime: new Date(event.endTime),
        portions: event.portions,
        portionSize: event.amountPerPortion,
        isEditMode: true
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.store.dispatch(new UpdateRecipyInCalendarActionNew(event, data))
    }
  }

}