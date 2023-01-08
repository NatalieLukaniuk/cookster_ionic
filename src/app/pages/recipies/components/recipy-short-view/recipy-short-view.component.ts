import { DataMappingService } from './../../../../services/data-mapping.service';
import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/auth.models';
import { DishType, Recipy } from 'src/app/models/recipies.models';

@Component({
  selector: 'app-recipy-short-view',
  templateUrl: './recipy-short-view.component.html',
  styleUrls: ['./recipy-short-view.component.scss'],
})
export class RecipyShortViewComponent implements OnInit {
  @Input()
  recipy!: Recipy;
  @Input()
  currentUser!: User | null;

  isNeedsAdvancePreparation: boolean = false;
  isPrepSuggestions: boolean = false;

  isRecipyClickedOnce: boolean = false;
  isRecipyClickedTwice: boolean = false;

  get preparationTime() {
    let time = 0;
    for (let step of this.recipy.steps) {
      time = time + +step.timeActive + +step.timePassive;
    }
    return time;
  }

  constructor(private datamapping: DataMappingService) {}

  ngOnInit() {
    this.isNeedsAdvancePreparation = this.recipy.type?.includes(
      DishType['потребує попередньої підготовки']
    );
    this.isPrepSuggestions = !!this.recipy.ingrediends.find(
      (ingr) => !!ingr.prep
    );
  }

  onRecipyClicked() {
    if (!this.isRecipyClickedOnce && !this.isRecipyClickedTwice) {
      this.isRecipyClickedOnce = true;
    } else if (this.isRecipyClickedOnce && !this.isRecipyClickedTwice) {
      this.isRecipyClickedOnce = false;
      this.isRecipyClickedTwice = true;
    } else if (this.isRecipyClickedTwice) {
      this.isRecipyClickedTwice = false;
    }
  }
}
