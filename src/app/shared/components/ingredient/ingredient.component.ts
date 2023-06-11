import {
  Ingredient,
  MeasuringUnit,
  MeasuringUnitOptionsFluid,
  MeasuringUnitOptionsGranular,
  MeasuringUnitOptionsHardHomogeneous,
  MeasuringUnitOptionsHardItems,
  MeasuringUnitOptionsHerbs,
  MeasuringUnitOptionsSpice,
  MeasuringUnitText,
  ProductType,
} from '../../../models/recipies.models';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataMappingService } from 'src/app/services/data-mapping.service';

export interface ItemOption {
  name: string,
  color: string,
  action: ItemOptionActions
}

export enum ItemOptionActions {
  Edit = 'edit',
  Delete = 'delete-no-confirm',
  DeleteWithConfirmation = 'delete-with-confirm',
  Move = 'move',
  AddPrep = 'add-prep'
}

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss'],
})
export class IngredientComponent implements OnInit {
  @Input() ingredient!: Ingredient;
  @Input() coefficient!: number;
  @Input() startOptions: ItemOption[] = [];
  @Input() endOptions: ItemOption[] = [];

  @Output() emitEvent = new EventEmitter<ItemOptionActions>();

  measuringUnit: MeasuringUnit = MeasuringUnit.gr;
  MeasuringUnit = MeasuringUnit;

  get productType() {
    let type: ProductType = ProductType.hardItem;
    for (let product of this.datamapping.products$.value) {
      if (product.id === this.ingredient.product) {
        type = product.type;
      }
    }
    return type;
  }

  get measurementUnits() {
    let optionsArray: MeasuringUnit[] = [];
    switch (this.productType) {
      case ProductType.fluid:
        optionsArray = MeasuringUnitOptionsFluid;
        break;
      case ProductType.hardItem:
        optionsArray = MeasuringUnitOptionsHardItems;
        break;
      case ProductType.herb:
        optionsArray = MeasuringUnitOptionsHerbs;
        break;
      case ProductType.spice:
        optionsArray = MeasuringUnitOptionsSpice;
        break;
      case ProductType.granular:
        optionsArray = MeasuringUnitOptionsGranular;
        break;
      case ProductType.hardHomogenious:
        optionsArray = MeasuringUnitOptionsHardHomogeneous;
    }
    return optionsArray;
  }

  getUnitText(unit: MeasuringUnit) {
    return MeasuringUnitText[unit];
  }

  constructor(private datamapping: DataMappingService) { }

  ngOnInit() {
    this.measuringUnit = this.ingredient.defaultUnit;
  }

  getIngredientText(ingredient: Ingredient): string {
    return this.datamapping.getIngredientText(ingredient);
  }

  unitChanged(event: any) {
    this.measuringUnit = event.detail.value;
  }

  onOptionClicked(action: ItemOptionActions) {
    this.emitEvent.emit(action);
  }
}
