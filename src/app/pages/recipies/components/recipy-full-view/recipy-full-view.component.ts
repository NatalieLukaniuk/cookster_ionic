import { DataMappingService } from './../../../../services/data-mapping.service';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Ingredient, ingredientsByGroup, IngredientsByGroup, Recipy } from 'src/app/models/recipies.models';
import { AVERAGE_PORTION } from 'src/app/shared/constants';

@Component({
  selector: 'app-recipy-full-view',
  templateUrl: './recipy-full-view.component.html',
  styleUrls: ['./recipy-full-view.component.scss'],
})
export class RecipyFullViewComponent implements OnInit, OnChanges {
  @Input() recipy: Recipy | undefined | null;

  @Input() portions?: number;
  @Input() amountPerPortion?: number;

  portionsToServe: number = 4;
  portionSize: number = AVERAGE_PORTION;

  coeficient: number = 1;

  isEditPortions = false;

  tabs = [
    { value: 'ingredients', icon: '', name: 'Інгридієнти' },
    { value: 'steps', icon: '', name: 'Приготування' },
    { value: 'info', icon: '', name: 'Інформація' },
  ];

  currentTab = this.tabs[0].value;

  isSplitToGroups: boolean = false;
  ingredientsByGroup: IngredientsByGroup = new ingredientsByGroup();

  constructor(private datamapping: DataMappingService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.recipy?.isSplitIntoGroups &&
      !!this.recipy.isSplitIntoGroups.length
    ) {
      this.isSplitToGroups = true;
      this.getIngredientsByGroup();
    }
  }

  ngOnInit() {
    if(this.portions){
      this.portionsToServe = this.portions;
    }

    if(this.amountPerPortion){
      this.portionSize = this.amountPerPortion;
    }

    this.getCoeficient();
  }

  onTabChange(event: any) {
    this.currentTab = event.detail.value;
  }

  getCoeficient() {
    if (this.recipy && this.portionsToServe) {
      let amount = 0;
      for (let ingr of this.recipy.ingrediends) {
        if (
          this.datamapping.getIsIngredientInDB(ingr.product) &&
          this.datamapping.getIsIngredientIncludedInAmountCalculation(ingr)
        ) {
          amount = ingr.amount + amount; // amount of ingreds with calories
        }
      }
      this.coeficient = (this.portionsToServe * this.portionSize) / amount;
    }
  }

  getIngredientsByGroup() {
    if (!!this.recipy && this.recipy.isSplitIntoGroups) {
      let ingredients = this.recipy.ingrediends;
      this.recipy.isSplitIntoGroups.forEach((group) => {
        this.ingredientsByGroup[group] = ingredients.filter(
          (ingredient) => ingredient.group == group
        );
      });
    }
  }
}
