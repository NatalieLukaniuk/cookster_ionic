import { MealTime } from 'src/app/models/calendar.models';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
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
  selectedMealTime: string = MealTime.Breakfast;
  selectedPortionOption: number = 4;
  amountPerPortion: number = AVERAGE_PORTION;

  presentingElement: Element | undefined | null;

  @Output() resultReceived = new EventEmitter<{
    meatime: MealTime;
    portions: number;
    amountPerPortion: number;
  }>();

  mealOptions: MealTime[] = [
    MealTime.Breakfast,
    MealTime.Lunch,
    MealTime.Dinner,
  ];

  constructor() {}

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
  }

  onDismissed() {
    this.resultReceived.emit({
      meatime: this.selectedMealTime as MealTime,
      portions: this.selectedPortionOption,
      amountPerPortion: this.amountPerPortion,
    });
  }
}
