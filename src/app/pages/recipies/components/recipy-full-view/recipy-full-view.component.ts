import { DataMappingService } from './../../../../services/data-mapping.service';
import { Component, Input, OnInit } from '@angular/core';
import { Ingredient, Recipy } from 'src/app/models/recipies.models';
import { AVERAGE_PORTION } from 'src/app/shared/constants';

@Component({
  selector: 'app-recipy-full-view',
  templateUrl: './recipy-full-view.component.html',
  styleUrls: ['./recipy-full-view.component.scss'],
})
export class RecipyFullViewComponent implements OnInit {
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

  constructor(private datamapping: DataMappingService) {}

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

  onportionSizeChanged() {
    this.getCoeficient();
  }
}
