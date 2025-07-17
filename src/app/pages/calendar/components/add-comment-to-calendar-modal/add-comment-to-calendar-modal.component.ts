import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { newDateIgnoreimezone } from '../../calendar.utils';

@Component({
  selector: 'app-add-comment-to-calendar-modal',
  templateUrl: './add-comment-to-calendar-modal.component.html',
  styleUrls: ['./add-comment-to-calendar-modal.component.scss']
})
export class AddCommentToCalendarModalComponent {
  selectedTime: Date | null = null;
  initialSelectDate = this.selectedTime?.toISOString();

  comment = '';

  title = 'Коментар'

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
    this.initialSelectDate = newDateIgnoreimezone(newDate).toISOString()
  }
}
