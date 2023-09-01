import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { MealTime, transformDate } from 'src/app/models/calendar.models';
import { Recipy } from 'src/app/models/recipies.models';
import { IAppState } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

@Component({
  selector: 'app-move-recipy-modal',
  templateUrl: './move-recipy-modal.component.html',
  styleUrls: ['./move-recipy-modal.component.scss']
})
export class MoveRecipyModalComponent implements OnInit {
  @Input() recipy!: Recipy | null;

  user$ = this.store.pipe(select(getCurrentUser));

  presentingElement: Element | undefined | null;

  date: string | null = null;

  mealTime: MealTime = MealTime.Breakfast;

  mealTimeOptions: MealTime[] = [];

  @ViewChild('moveRecipy') modal: IonModal | undefined;

  constructor(private store: Store<IAppState>) { }

  ngOnInit(): void {
    this.presentingElement = document.querySelector('.ion-page');

    this.mealTimeOptions = Object.values(MealTime);
  }

  dateSelected(event: any) {
    this.date = transformDate(new Date(event.detail.value));
  }
}
