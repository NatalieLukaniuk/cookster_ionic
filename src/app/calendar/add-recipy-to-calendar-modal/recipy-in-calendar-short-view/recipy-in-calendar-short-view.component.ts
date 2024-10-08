import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DishType, Recipy } from 'src/app/models/recipies.models';

@Component({
  selector: 'app-recipy-in-calendar-short-view',
  templateUrl: './recipy-in-calendar-short-view.component.html',
  styleUrls: ['./recipy-in-calendar-short-view.component.scss'],
})
export class RecipyInCalendarShortViewComponent implements OnInit {

  @Input() recipy!: Recipy;
  @Output() recipyClicked = new EventEmitter<Recipy>()

  constructor() { }

  ngOnInit() { }

  onRecipyClicked() {
    this.recipyClicked.emit(this.recipy)
  }

  preparationTime(recipy: Recipy) {
    let time = 0;
    for (let step of recipy.steps) {
      time = time + +step.timeActive + +step.timePassive;
    }
    return time;
  }

  activePreparationTime(recipy: Recipy) {
    let time = 0;
    for (let step of recipy.steps) {
      time = time + +step.timeActive;
    }
    return time;
  }

  passivePreparationTime(recipy: Recipy) {
    let time = 0;
    for (let step of recipy.steps) {
      time = time + +step.timePassive;
    }
    return time;
  }

  Math = Math;

  DishType = DishType;
  
  isNeedsAdvancePreparation(recipy: Recipy) {
    return recipy.type?.includes(DishType['потребує попередньої підготовки']);
  }

}
