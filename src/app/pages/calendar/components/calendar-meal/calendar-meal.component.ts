import { AddCommentToCalendarAction, AddRecipyToCalendarAction, RemoveCommentFromCalendarAction } from './../../../../store/actions/calendar.actions';
import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnChanges,
  ViewChild,
} from '@angular/core';
import * as _ from 'lodash';
import {
  Day,
  MealTime,
  RecipyForCalendar,
} from 'src/app/models/calendar.models';
import { IAppState } from 'src/app/store/reducers';
import { Store, select } from '@ngrx/store';
import { Recipy } from 'src/app/models/recipies.models';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

@Component({
  selector: 'app-calendar-meal',
  templateUrl: './calendar-meal.component.html',
  styleUrls: ['./calendar-meal.component.scss'],
})
export class CalendarMealComponent implements OnInit, OnChanges {
  @Input() day!: Day;
  @Input() mealtime!: MealTime;
  @Input() addRecipies!: boolean;

  selectedRecipyForCalendar: Recipy | null = null;

  _day: Day | undefined;

  user$ = this.store.pipe(select(getCurrentUser));

  get isComments() {
    if (this._day) {
      return this._day.details.comments.find(commentItem => commentItem.mealTime === this.mealtime);
    } else return false
  }

  get mealtimeText() {
    switch (this.mealtime) {
      case MealTime.Breakfast:
        return 'Сніданок';
      case MealTime.Lunch:
        return 'Обід';
      case MealTime.Dinner:
        return 'Вечеря';
    }
  }

  get detailedRecipiesList() {
    if (this._day) {
      switch (this.mealtime) {
        case MealTime.Breakfast:
          return this._day.details.breakfastRecipies;
        case MealTime.Lunch:
          return this._day.details.lunchRecipies;
        case MealTime.Dinner:
          return this._day.details.dinnerRecipies;
      }
    } else return [];
  }

  constructor(private store: Store<IAppState>) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['day']?.currentValue) {
      this._day = _.cloneDeep(this.day);
    }
  }

  getPortions(): number | null {
    if (this._day) {
      if (this._day.details) {
        switch (this.mealtime) {
          case MealTime.Breakfast:
            return !!this._day.details.breakfastRecipies.length
              ? this._day.details.breakfastRecipies.reduce(
                (prev, cur) => Math.max(prev, cur.portions),
                0
              )
              : null;
          case MealTime.Lunch:
            return !!this._day.details.lunchRecipies.length
              ? this._day.details.lunchRecipies.reduce(
                (prev, cur) => Math.max(prev, cur.portions),
                0
              )
              : null;
          case MealTime.Dinner:
            return !!this.day.details.dinnerRecipies.length
              ? this._day.details.dinnerRecipies.reduce(
                (prev, cur) => Math.max(prev, cur.portions),
                0
              )
              : null;
          default:
            return null;
        }
      } else return null;
    } else return null;
  }

  portionsText(portionsNumber: number | null) {
    if (!portionsNumber) {
      return '';
    }
    if (portionsNumber <= 1) {
      return 'порція';
    } else if (portionsNumber > 1 && portionsNumber < 5) {
      return 'порції';
    } else return 'порцій';
  }

  getAmountPerPerson() {
    if (this._day && this._day.details) {
      switch (this.mealtime) {
        case MealTime.Breakfast: {
          let amount = 0;
          if (!!this._day.details.breakfastRecipies.length) {
            this._day.details.breakfastRecipies.forEach(
              (recipy: RecipyForCalendar) => {
                amount = amount + recipy.amountPerPortion;
              }
            );
          }
          return amount;
        }
        case MealTime.Lunch: {
          let amount = 0;
          if (!!this._day.details.lunchRecipies.length) {
            this._day.details.lunchRecipies.forEach(
              (recipy: RecipyForCalendar) => {
                amount = amount + recipy.amountPerPortion;
              }
            );
          }
          return amount;
        }
        case MealTime.Dinner: {
          let amount = 0;
          if (!!this._day.details.dinnerRecipies.length) {
            this._day.details.dinnerRecipies.forEach(
              (recipy: RecipyForCalendar) => {
                amount = amount + recipy.amountPerPortion;
              }
            );
          }
          return amount;
        }
        default:
          return null;
      }
    } else return null;
  }

  getCalories(): number | null {
    if (this._day) {
      if (this._day.details) {
        switch (this.mealtime) {
          case MealTime.Breakfast:
            return this.getCaloriesPerPortion(
              this._day.details.breakfastRecipies
            );
          case MealTime.Lunch:
            return this.getCaloriesPerPortion(this._day.details.lunchRecipies);
          case MealTime.Dinner:
            return this.getCaloriesPerPortion(this._day.details.dinnerRecipies);
          default:
            return null;
        }
      } else return null;
    } else return null;
  }

  getCaloriesPerPortion(recipies: RecipyForCalendar[]) {
    let total = 0;
    recipies.forEach(
      (recipy) =>
      (total += Math.round(
        (recipy.calorificValue! * recipy.amountPerPortion) / 100
      ))
    );
    return total;
  }

  @ViewChild('selectOption') modal: any;
  onRecipySelected(recipy: Recipy) {
    this.selectedRecipyForCalendar = recipy;
    setTimeout(() => {      
      this.modal.modal.present();
    }, 200);

    this.modal.modal.onDidDismiss().then((res: any) => {
      if (res.role === 'confirm') {
        this.store.dispatch(
          new AddRecipyToCalendarAction(
            recipy.id,
            this.day.details.day,
            this.mealtime,
            res.data.portions,
            res.data.amount,
            0
          )
        );
      }
      this.selectedRecipyForCalendar = null;
    });
  }

  @ViewChild('addCommentModal') addCommentModal: any;
  onAddComment(comment: string) {
    this.store.dispatch(
      new AddCommentToCalendarAction(
        comment,
        this.day.details.day,
        this.mealtime,
        0
      )
    );
    this.addCommentModal.comment = '';
  }

  onDeleteComment(comment: any){
    this.store.dispatch(
      new RemoveCommentFromCalendarAction(
        comment.comment,
        this.day.details.day,
        comment.mealTime,
      )
    );
  }
}
