import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-reminder-modal',
  templateUrl: './add-reminder-modal.component.html',
  styleUrls: ['./add-reminder-modal.component.scss']
})
export class AddReminderModalComponent {
  date: any;
  time: any;
  description: string = '';

  constructor(private modalCtrl: ModalController) { }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss({ date: this.date, time: this.time, description: this.description }, 'confirm');
  }
}
