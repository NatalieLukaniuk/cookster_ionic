import { Component, Input, OnInit } from '@angular/core';
import { RecipyForCalendar_Reworked } from '../calendar.models';
import { DishType } from 'src/app/models/recipies.models';

@Component({
  selector: 'app-recipy-preview',
  templateUrl: './recipy-preview.component.html',
  styleUrls: ['./recipy-preview.component.scss'],
})
export class RecipyPreviewComponent  implements OnInit {
  @Input() recipy!: RecipyForCalendar_Reworked;

  Math = Math;
  DishType = DishType;
  showNeedsAdvancePreparation: boolean = false;
  constructor() { }

  ngOnInit() {
    this.showNeedsAdvancePreparation = this.recipy.type.includes(
      DishType['потребує попередньої підготовки']
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
