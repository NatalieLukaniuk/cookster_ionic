import { IonModal } from '@ionic/angular';
import { MealTime } from 'src/app/models/calendar.models';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  Input,
} from '@angular/core';
import { AVERAGE_PORTION } from 'src/app/shared/constants';
import { Recipy } from 'src/app/models/recipies.models';
import { select, Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

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
  @Input() recipy!: Recipy;
  @Input() meatime!: MealTime;
  @Input() date!: string;
  selectedPortionOption: number = 4;
  amountPerPortion: number = AVERAGE_PORTION;

  presentingElement: Element | undefined | null;

  @Output() resultReceived = new EventEmitter<{
    portions: number;
    amountPerPortion: number;
  }>();

  user$ = this.store.pipe(select(getCurrentUser));

  @ViewChild('selectOption') modal: IonModal | undefined;

  constructor(private store: Store<IAppState>) { }

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
  }

  get mealtimeText() {
    switch (this.meatime) {
      case MealTime.Breakfast:
        return 'Сніданок';
      case MealTime.Lunch:
        return 'Обід';
      case MealTime.Dinner:
        return 'Вечеря';
    }
  }
}
