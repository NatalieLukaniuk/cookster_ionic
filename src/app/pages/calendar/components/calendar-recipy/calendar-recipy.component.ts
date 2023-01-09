import { Component, Input, OnInit } from '@angular/core';
import { RecipyForCalendar } from 'src/app/models/calendar.models';
import { DishType } from 'src/app/models/recipies.models';

@Component({
  selector: 'app-calendar-recipy',
  templateUrl: './calendar-recipy.component.html',
  styleUrls: ['./calendar-recipy.component.scss'],
})
export class CalendarRecipyComponent implements OnInit {
  @Input() recipy!: RecipyForCalendar;

  hasPrepSuggestions: boolean = false;
  showNeedsAdvancePreparation: boolean = false;

  Math = Math;
  constructor() {}

  ngOnInit() {
    this.showNeedsAdvancePreparation = this.recipy.type.includes(
      DishType['потребує попередньої підготовки']
    );
    this.hasPrepSuggestions = !!this.recipy.ingrediends.find(
      (ingr) => !!ingr.prep
    );
  }
}
