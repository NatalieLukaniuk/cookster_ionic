import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { Recipy } from 'src/app/models/recipies.models';
import { DataMappingService } from 'src/app/services/data-mapping.service';
import { AVERAGE_PORTION } from 'src/app/shared/constants';

@Component({
  selector: 'app-ingredients-tab',
  templateUrl: './ingredients-tab.component.html',
  styleUrls: ['./ingredients-tab.component.scss'],
})
export class IngredientsTabComponent implements OnInit, OnChanges {
  @Input() recipy!: Recipy;

  @Input() portions?: number;
  @Input() amountPerPortion?: number;

  @Output() portionsChanged = new EventEmitter<{
    portions: number;
    amountPerPortion: number;
  }>();

  isEditPortions = false;

  isSplitToGroups: boolean = false;
  ingredientsByGroup = <Record<string, any>>{};

  portionsToServe: number = 4;
  portionSize: number = AVERAGE_PORTION;

  coeficient: number = 1;

  constructor(private datamapping: DataMappingService) {}

  ngOnInit() {
    if (this.portions) {
      this.portionsToServe = this.portions;
    }

    if (this.amountPerPortion) {
      this.portionSize = this.amountPerPortion;
    }

    this.getCoeficient();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.recipy.isSplitIntoGroups) {
      this.isSplitToGroups = true;
      this.getIngredientsByGroup();
    }
  }

  getIngredientsByGroup() {
    if (!!this.recipy && this.recipy.isSplitIntoGroups) {
      let ingredients = this.recipy.ingrediends;
      let groups = this.getGroups();

      groups.forEach((group) => {
        this.ingredientsByGroup[group] = ingredients.filter(
          (ingredient) => ingredient.group == group
        );
      });
    }
  }

  getGroups(): string[] {
    let group: string[] = [];
    for (let ingr of this.recipy.ingrediends) {
      if (ingr.group && !group.includes(ingr.group)) {
        group.push(ingr.group);
      }
    }
    return group;
  }

  getCoeficient() {
    if (this.recipy && this.portionsToServe) {
      this.coeficient = this.datamapping.getCoeficient(
        this.recipy.ingrediends,
        this.portionsToServe,
        this.portionSize
      );
    }
  }

  onPortionsChanged() {
    this.portionsChanged.emit({
      portions: this.portionsToServe,
      amountPerPortion: this.portionSize,
    });

    this.isEditPortions = false;
  }
}
