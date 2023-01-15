import { Router, ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import {
  Day,
  MealTime,
  RecipyForCalendar,
} from 'src/app/models/calendar.models';
import { DishType } from 'src/app/models/recipies.models';

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
    this.router.navigate(['recipy', this.recipy.id], {
      relativeTo: this.route,
      queryParams: {
        portions: this.recipy.portions,
        amountPerPortion: this.recipy.amountPerPortion,
        day: this.day.details.day,
        mealtime: this.mealtime,
      },
    });
  }
}
