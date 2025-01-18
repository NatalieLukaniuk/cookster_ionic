import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AddRecipyToCalendarModalComponent } from 'src/app/pages/calendar/components/add-recipy-to-calendar-modal/add-recipy-to-calendar-modal.component';
import { CalendarReworkedService } from 'src/app/pages/calendar/calendar-reworked.service';
import { AddCommentToCalendarAction, AddRecipyToCalendarActionNew } from 'src/app/store/actions/calendar.actions';
import { IAppState } from 'src/app/store/reducers';
import { AddCommentToCalendarModalComponent } from './components/add-comment-to-calendar-modal/add-comment-to-calendar-modal.component';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage {
  
  constructor(private modalCtrl: ModalController, private store: Store<IAppState>, private calendarService: CalendarReworkedService){}

  public actionSheetButtons = [
    {
      text: 'Рецепт',
      data: {
        action: 'recipy',
      },
    },
    {
      text: 'Коментар',
      data: {
        action: 'comment',
      },
    },
    {
      text: 'Нагадування',
      data: {
        action: 'reminder',
      },
    },
    {
      text: 'Cancel',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

  onActionSelected(event: any){
    switch(event.detail.data.action){
      case "recipy": this.addRecipy();
      break;
      case 'comment': this.addComment();
      break;
      case 'reminder': this.addReminder();
      break;
      default: null
    }

  }

  async addReminder(){
    const currentDay = this.calendarService.getCurrentDayValue()
    const modal = await this.modalCtrl.create({
      component: AddCommentToCalendarModalComponent,
      componentProps: {
        title: 'Нагадування',
        selectedTime:  currentDay
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.store.dispatch(
        new AddCommentToCalendarAction(
          data.comment,
          data.selectedDate,
          true
        )
      );
    }
  }

  async addComment(){
    const currentDay = this.calendarService.getCurrentDayValue()
    const modal = await this.modalCtrl.create({
      component: AddCommentToCalendarModalComponent,
      componentProps: {
        selectedTime:  currentDay
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.store.dispatch(
        new AddCommentToCalendarAction(
          data.comment,
          data.selectedDate,
          false
        )
      );
    }
  }
  

  async addRecipy() {
    const currentDay = this.calendarService.getCurrentDayValue()
    const modal = await this.modalCtrl.create({
      component: AddRecipyToCalendarModalComponent,
      componentProps: {
        isEditMode: true,
        selectedTime: currentDay
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.store.dispatch(new AddRecipyToCalendarActionNew(data));
    }
  }
}
