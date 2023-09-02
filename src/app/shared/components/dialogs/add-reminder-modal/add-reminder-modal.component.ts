import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { transformDate } from 'src/app/models/calendar.models';

@Component({
  selector: 'app-add-reminder-modal',
  templateUrl: './add-reminder-modal.component.html',
  styleUrls: ['./add-reminder-modal.component.scss']
})
export class AddReminderModalComponent {
  date: any;
  description: string = '';

  dateTime: Date | undefined;

  constructor(private modalCtrl: ModalController) {
   }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss({ date: this.date, fullDate: this.dateTime, description: this.description }, 'confirm');
  }

  onDateTimeChanged(event: any){
    this.dateTime = new Date(event.detail.value);
    this.date = transformDate(new Date(event.detail.value));
  }
}
