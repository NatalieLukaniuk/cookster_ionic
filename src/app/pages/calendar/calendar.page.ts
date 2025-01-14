import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AddCommentToCalendarModalComponent } from 'src/app/calendar/add-comment-to-calendar-modal/add-comment-to-calendar-modal.component';
import { AddRecipyToCalendarModalComponent } from 'src/app/calendar/add-recipy-to-calendar-modal/add-recipy-to-calendar-modal.component';
import { AddCommentToCalendarAction, AddRecipyToCalendarActionNew } from 'src/app/store/actions/calendar.actions';
import { IAppState } from 'src/app/store/reducers';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage {
  
  constructor(private modalCtrl: ModalController, private store: Store<IAppState>,){}

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

  addReminder(){

  }

  async addComment(){
    const modal = await this.modalCtrl.create({
      component: AddCommentToCalendarModalComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.store.dispatch(
        new AddCommentToCalendarAction(
          data.comment,
          data.selectedDate
        )
      );
    }
  }
  

  async addRecipy() {
    const modal = await this.modalCtrl.create({
      component: AddRecipyToCalendarModalComponent,
      componentProps: {
        isEditMode: true
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.store.dispatch(new AddRecipyToCalendarActionNew(data));
    }
  }
}
