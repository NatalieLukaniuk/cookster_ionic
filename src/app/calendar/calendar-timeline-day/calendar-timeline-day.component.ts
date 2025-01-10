import { ModalController } from '@ionic/angular';
import { AddRecipyToCalendarModalComponent } from '../add-recipy-to-calendar-modal/add-recipy-to-calendar-modal.component';
import { RecipyForCalendar_Reworked } from './../calendar.models';
import { Component, Input } from '@angular/core';
import { UpdateRecipyInCalendarActionNew } from 'src/app/store/actions/calendar.actions';
import { IAppState } from 'src/app/store/reducers';
import { Store } from '@ngrx/store';
import { iSameDay, MINUTES_IN_DAY } from '../calendar.utils';

const MINUTES_IN_PIXEL = 1;

const HOURS_IN_DAY = 24;

@Component({
  selector: 'app-calendar-timeline-day',
  templateUrl: './calendar-timeline-day.component.html',
  styleUrls: ['./calendar-timeline-day.component.scss'],
})
export class CalendarTimelineDayComponent {
  PIXELS_IN_DAY = (HOURS_IN_DAY * 60) / MINUTES_IN_PIXEL;

  @Input() recipies: RecipyForCalendar_Reworked[] | null = [];
  @Input() selectedDay: string | undefined;

  timelineScaleItems = Array.from({ length: HOURS_IN_DAY }, (v, i) => i)

  constructor(
    private modalCtrl: ModalController,
    private store: Store<IAppState>,
  ) { }

  getRecipyTopMargin(recipy: RecipyForCalendar_Reworked) {
    if ('overflowStart' in recipy && recipy.overflowStart && this.selectedDay && iSameDay(recipy.overflowStart, new Date(this.selectedDay))) {

      const minutesInToday = (new Date(recipy.overflowStart).getHours() * 60) + new Date(recipy.overflowStart).getMinutes();
      return minutesInToday / MINUTES_IN_PIXEL
    } else {
      const minutesTillEndTime = (new Date(recipy.endTime).getHours() * 60) + new Date(recipy.endTime).getMinutes();
      const startTime = minutesTillEndTime - this.getRecipyHeight(recipy);
      if (startTime > 0) {
        return startTime / MINUTES_IN_PIXEL
      } else {
        return 0
      }
    }

  }

  getRecipyHeight(recipy: RecipyForCalendar_Reworked): number {
    if ('overflowStart' in recipy) {
      if(recipy.overflowStart && this.selectedDay && !iSameDay(recipy.overflowStart, new Date(this.selectedDay))){
        return MINUTES_IN_DAY / MINUTES_IN_PIXEL
      } else if (recipy.overflowStart && this.selectedDay){
        const minutesTillEndTime = MINUTES_IN_DAY - ((new Date(recipy.overflowStart).getHours() * 60) + new Date(recipy.overflowStart).getMinutes());
        return minutesTillEndTime / MINUTES_IN_PIXEL;
      } else {
        return 0
      }
      

    } else {
      let time = 0;
      for (let step of recipy.steps) {
        time = time + +step.timeActive + +step.timePassive;
      }
      if (time <= MINUTES_IN_DAY) {
        return time / MINUTES_IN_PIXEL;
      } else {
        const minutesTillEndTime =(new Date(recipy.endTime).getHours() * 60) + new Date(recipy.endTime).getMinutes();
        return minutesTillEndTime / MINUTES_IN_PIXEL;
      }

    }

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