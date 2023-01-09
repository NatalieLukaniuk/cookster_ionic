import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import * as _ from 'lodash';
import {
  Day,
  MealTime,
  RecipyForCalendar,
} from 'src/app/models/calendar.models';

@Component({
  selector: 'app-calendar-meal',
  templateUrl: './calendar-meal.component.html',
  styleUrls: ['./calendar-meal.component.scss'],
})
export class CalendarMealComponent implements OnInit, OnChanges {
  @Input() day!: Day;
  @Input() mealtime!: MealTime;

  _day: Day | undefined;

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

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['day'].currentValue) {
      this._day = _.cloneDeep(this.day);
    }
  }

  getPortions(): number | null {
    if (this._day) {
      if (this._day.details) {
        switch (this.mealtime) {
          case MealTime.Breakfast:
            return !!this._day.details.breakfastRecipies[0]
              ? this._day.details.breakfastRecipies[0].portions
              : null;
          case MealTime.Lunch:
            return !!this._day.details.lunchRecipies[0]
              ? this._day.details.lunchRecipies[0].portions
              : null;
          case MealTime.Dinner:
            return !!this.day.details.dinnerRecipies[0]
              ? this._day.details.dinnerRecipies[0].portions
              : null;
          default:
            return null;
        }
      } else return null;
    } else return null;
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
}
