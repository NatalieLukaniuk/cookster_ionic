import { ModalController } from '@ionic/angular';
import { AddRecipyToCalendarModalComponent } from '../add-recipy-to-calendar-modal/add-recipy-to-calendar-modal.component';
import { CalendarComment, RecipyForCalendar_Reworked } from '../../../../models/calendar.models';
import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UpdateRecipyInCalendarActionNew } from 'src/app/store/actions/calendar.actions';
import { IAppState } from 'src/app/store/reducers';
import { Store } from '@ngrx/store';
import { iSameDay, MINUTES_IN_DAY } from '../../calendar.utils';


const MINUTES_IN_PIXEL = 2;

const HOURS_IN_DAY = 24;

@Component({
  selector: 'app-calendar-timeline-day',
  templateUrl: './calendar-timeline-day.component.html',
  styleUrls: ['./calendar-timeline-day.component.scss'],
})
export class CalendarTimelineDayComponent implements OnChanges, AfterViewInit {
  PIXELS_IN_DAY = (HOURS_IN_DAY * 60) / MINUTES_IN_PIXEL;
  dayStartIndex = 6;
  dayEndIndex = 21;

  @Input() recipies: RecipyForCalendar_Reworked[] | null = [];
  @Input() comments: CalendarComment[] | null = [];
  @Input() selectedDay: string | undefined;

  timelineScaleItems = Array.from({ length: HOURS_IN_DAY }, (v, i) => i)

  constructor(
    private modalCtrl: ModalController,
    private store: Store<IAppState>,
  ) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.processSelectedDayVisuals();

    }, 200)

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDay']) {
      this.processSelectedDayVisuals()
    }

  }

  processSelectedDayVisuals() {
    if (this.selectedDay && !iSameDay(new Date(), new Date(this.selectedDay))) {
      this.scrollToDay()
    } else {
      this.scrollToNow()
    }
    this.removeNowLine()
    if (this.selectedDay && iSameDay(new Date(), new Date(this.selectedDay))) {
      this.drawNowLine()
    } else {

    }
  }

  drawNowLine() {
    const now = new Date();
    const index = now.getHours();
    const id = 'scale-grid-item-' + index;

    const pointNow = document.getElementById(id);
    pointNow?.classList.add('point-now');
  }

  removeNowLine() {
    const toRemove = document.getElementsByClassName('point-now');

    if (toRemove.length) {
      for (let i = 0; i <= toRemove.length; i++) {
        toRemove.item(i)?.classList.remove('point-now')
      }
    }
  }

  scrollToDay() {
    const id = 'scale-item-' + this.dayStartIndex
    const dayStart = document.getElementById(id);
    dayStart?.scrollIntoView({ block: "start", inline: "nearest" });
  }

  scrollToNow() {
    const now = new Date();
    const index = now.getHours();
    const id = 'scale-item-' + index
    const pointNow = document.getElementById(id);
    pointNow?.scrollIntoView({ block: "start", inline: "nearest" });
  }

  getRecipyTopMargin(recipy: RecipyForCalendar_Reworked) {
    if ('prepStart' in recipy && recipy.prepStart && this.selectedDay && iSameDay(recipy.prepStart, new Date(this.selectedDay)) && !iSameDay(recipy.prepStart, new Date(recipy.endTime))) {

      const minutesInToday = (new Date(recipy.prepStart).getHours() * 60) + new Date(recipy.prepStart).getMinutes();
      return minutesInToday / MINUTES_IN_PIXEL
    } else {
      const minutesTillEndTime = (new Date(recipy.endTime).getHours() * 60) + new Date(recipy.endTime).getMinutes();
      const startTime = minutesTillEndTime - (this.getRecipyHeight(recipy) * MINUTES_IN_PIXEL);
      if (startTime > 0) {
        return startTime / MINUTES_IN_PIXEL
      } else {
        return 0
      }
    }

  }

  getCommentTopMargin(comment: CalendarComment) {
    const minutesTillTime = (new Date(comment.date).getHours() * 60) + new Date(comment.date).getMinutes();
    return minutesTillTime / MINUTES_IN_PIXEL
  }

  getCommentBackground(comment: CalendarComment) {
    return comment.isReminder ? '#FCD786' : 'var(--ion-color-light)'
  }

  getRecipyHeight(recipy: RecipyForCalendar_Reworked): number {

    if (recipy.prepStart && this.selectedDay && !iSameDay(recipy.prepStart, new Date(recipy.endTime)) && !iSameDay(new Date(recipy.endTime), new Date(this.selectedDay))) {
      if (recipy.prepStart && this.selectedDay && !iSameDay(recipy.prepStart, new Date(this.selectedDay))) {
        return MINUTES_IN_DAY / MINUTES_IN_PIXEL
      } else if (recipy.prepStart && this.selectedDay) {
        const minutesTillEndTime = MINUTES_IN_DAY - ((new Date(recipy.prepStart).getHours() * 60) + new Date(recipy.prepStart).getMinutes());
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
        const minutesTillEndTime = (new Date(recipy.endTime).getHours() * 60) + new Date(recipy.endTime).getMinutes();
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