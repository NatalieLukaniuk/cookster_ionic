import { IonModal } from '@ionic/angular';
import { MealTime } from 'src/app/models/calendar.models';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { AVERAGE_PORTION } from 'src/app/shared/constants';

export interface DialogData {
  title: string;
  mealOptions?: string[];
}

@Component({
  selector: 'app-select-option-dialog',
  templateUrl: './select-option-dialog.component.html',
  styleUrls: ['./select-option-dialog.component.scss'],
})
export class SelectOptionDialogComponent implements OnInit {
  selectedPortionOption: number = 4;
  amountPerPortion: number = AVERAGE_PORTION;

  presentingElement: Element | undefined | null;

  @Output() resultReceived = new EventEmitter<{
    portions: number;
    amountPerPortion: number;
  }>();

  @ViewChild('selectOption') modal: IonModal | undefined;

  constructor() {}

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
  }
}
