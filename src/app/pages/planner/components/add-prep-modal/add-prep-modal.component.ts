import { Suggestion } from './../../../../models/calendar.models';
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  MeasuringUnit,
  MeasuringUnitText,
} from 'src/app/models/recipies.models';

@Component({
  selector: 'app-add-prep-modal',
  templateUrl: './add-prep-modal.component.html',
  styleUrls: ['./add-prep-modal.component.scss'],
})
export class AddPrepModalComponent {
  prep!: Suggestion;
  day: Date | null = null;
  showPicker = false;
  constructor(private modalCtrl: ModalController) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  dateTimePicked(event: any) {
    this.day = event.detail.value;
  }

  confirm() {
    return this.modalCtrl.dismiss({ ...this.prep, day: this.day }, 'confirm');
  }

  getUnitText(unit: MeasuringUnit) {
    return MeasuringUnitText[unit];
  }
}
