import { LayoutService } from 'src/app/services/layout.service';
import { IonModal } from '@ionic/angular';
import { MealTime } from 'src/app/models/calendar.models';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  Input,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { AVERAGE_PORTION } from 'src/app/shared/constants';
import { Recipy } from 'src/app/models/recipies.models';
import { select, Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { BehaviorSubject, Subject, combineLatest, map, pipe, takeUntil } from 'rxjs';

export interface DialogData {
  title: string;
  mealOptions?: string[];
}

@Component({
  selector: 'app-select-option-dialog',
  templateUrl: './select-option-dialog.component.html',
  styleUrls: ['./select-option-dialog.component.scss'],
})
export class SelectOptionDialogComponent implements OnInit, OnDestroy, OnChanges {
  @Input() recipy!: Recipy | null;
  @Input() meatime!: MealTime;
  @Input() date!: string;
  selectedPortionOption: number = 4;
  amountPerPortion: number = AVERAGE_PORTION;

  presentingElement: Element | undefined | null;

  isBigScreen = this.layoutService.getIsBigScreen();

  @Output() resultReceived = new EventEmitter<{
    portions: number;
    amountPerPortion: number;
  }>();

  user$ = this.store.pipe(select(getCurrentUser));

  destroy$ = new Subject<void>();

  isUseDefaultPortionSettings$ = this.user$.pipe(map(user => {
    if (user && user.preferences) {
      return !user.preferences.isUsePersonalizedPortionSize && !user.preferences.isUseRecommendedPortionSize
    } else { return true }
  }))

  isUseRecommendedPortionSize$ = this.user$.pipe(map(user => {
    if (user && user.preferences) {
      return user.preferences.isUseRecommendedPortionSize
    } else { return false }
  }))

  numberOfFamilyMembers$ = this.user$.pipe(map(user => {
    if (user && user.family && !!user.family.length) {
      return user.family.length
    } else { return 0 }
  }))

  recipyChanged$ = new BehaviorSubject<Recipy>({} as Recipy);

  @ViewChild('selectOption') modal: IonModal | undefined;

  constructor(private store: Store<IAppState>, private layoutService: LayoutService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['recipy']) {
      this.recipyChanged$.next(changes['recipy'].currentValue)
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }
  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');

    combineLatest([this.isUseDefaultPortionSettings$,
    this.isUseRecommendedPortionSize$,
    this.numberOfFamilyMembers$,
    this.user$,
    this.recipyChanged$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([isUseDefaultPortionSettings, isUseRecommendedPortionSize, numberOfFamilyMembers, user]) => {
        if (isUseDefaultPortionSettings ||
          (isUseRecommendedPortionSize && !this.recipy?.portionSize)) {
          this.amountPerPortion = user?.preferences?.defaultPortionSize ?
            user.preferences.defaultPortionSize : AVERAGE_PORTION;
        } else if (isUseRecommendedPortionSize && this.recipy?.portionSize) {
          this.amountPerPortion = this.recipy.portionSize
        }

        if (!!numberOfFamilyMembers) {
          this.selectedPortionOption = numberOfFamilyMembers
        }
      })
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
