import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { IonModal, ModalController } from '@ionic/angular';
import { MealTime } from 'src/app/models/calendar.models';

@Component({
  selector: 'app-add-comment-to-calendar-modal',
  templateUrl: './add-comment-to-calendar-modal.component.html',
  styleUrls: ['./add-comment-to-calendar-modal.component.scss']
})
export class AddCommentToCalendarModalComponent {
  selectedTime: Date | null = null;

  comment = '';

  constructor(private modalCtrl: ModalController){

  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  get isValid(){
    return !!this.comment.length && this.selectedTime;
  }

  confirm(){
    this.modalCtrl.dismiss({comment: this.comment, selectedDate: this.selectedTime}, 'confirm');
  }

  onDateChanged(newDate: string) {
    this.selectedTime = new Date(newDate);
  }
}
