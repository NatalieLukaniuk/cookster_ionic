import { RemoveRecipyFromCalendarAction } from './../../../../store/actions/calendar.actions';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import {
  Day,
  MealTime,
  RecipyForCalendar,
} from 'src/app/models/calendar.models';
import { DishType } from 'src/app/models/recipies.models';
import { IAppState } from 'src/app/store/reducers';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-calendar-recipy',
  templateUrl: './calendar-recipy.component.html',
  styleUrls: ['./calendar-recipy.component.scss'],
})
export class CalendarRecipyComponent implements OnInit {
  @Input() recipy!: RecipyForCalendar;
  @Input()
  day!: Day;
  @Input()
  mealtime!: MealTime;

  hasPrepSuggestions: boolean = false;
  showNeedsAdvancePreparation: boolean = false;

  Math = Math;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<IAppState>
  ) {}

  ngOnInit() {
    this.showNeedsAdvancePreparation = this.recipy.type.includes(
      DishType['потребує попередньої підготовки']
    );
    this.hasPrepSuggestions = !!this.recipy.ingrediends.find(
      (ingr) => !!ingr.prep
    );
  }

  viewRecipy() {
    if (window.location.pathname.includes('calendar')) {
      this.router.navigate(['recipy', this.recipy.id], {
        relativeTo: this.route,
        queryParams: {
          portions: this.recipy.portions,
          amountPerPortion: this.recipy.amountPerPortion,
          day: this.day.details.day,
          mealtime: this.mealtime,
        },
      });
    } else if(window.location.pathname.includes('planner')) {
      this.router.navigate(['tabs', 'planner', 'recipy', this.recipy.id], {
        relativeTo: this.route.parent,
        queryParams: {
          portions: this.recipy.portions,
          amountPerPortion: this.recipy.amountPerPortion,
          day: this.day.details.day,
          mealtime: this.mealtime,
        },
      });
    }
  }

  onDelete() {
    this.store.dispatch(
      new RemoveRecipyFromCalendarAction(
        this.recipy.id,
        this.day.details.day,
        this.mealtime
      )
    );
  }

  activePreparationTime() {
    let time = 0;
    for (let step of this.recipy.steps) {
      time = time + +step.timeActive;
    }
    return time;
  }

  passivePreparationTime() {
    let time = 0;
    for (let step of this.recipy.steps) {
      time = time + +step.timePassive;
    }
    return time;
  }
}
