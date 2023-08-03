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
        optionsArray = this.filterOutForeignUnits(MeasuringUnitOptionsFluid);
        break;
      case ProductType.hardItem:
        optionsArray = this.filterOutForeignUnits(MeasuringUnitOptionsHardItems);
        break;
      case ProductType.herb:
        optionsArray = this.filterOutForeignUnits(MeasuringUnitOptionsHerbs);
        break;
      case ProductType.spice:
        optionsArray = this.filterOutForeignUnits(MeasuringUnitOptionsSpice);
        break;
      case ProductType.granular:
        optionsArray = this.filterOutForeignUnits(MeasuringUnitOptionsGranular);
        break;
      case ProductType.hardHomogenious:
        optionsArray = this.filterOutForeignUnits(MeasuringUnitOptionsHardHomogeneous);
    }
    return optionsArray;
  }

  filterOutForeignUnits(array: MeasuringUnit[]) {
    return array.filter(unit => unit !== MeasuringUnit.us_cup &&
      unit !== MeasuringUnit.oz &&
      unit !== MeasuringUnit.lb &&
      unit !== MeasuringUnit.cl &&
      unit !== MeasuringUnit.none)
  }

  getUnitText(unit: MeasuringUnit) {
    return MeasuringUnitText[unit];
  }

  constructor(private datamapping: DataMappingService) { }

  ngOnInit() {
    if (this.ingredient.defaultUnit === MeasuringUnit.oz ||
      this.ingredient.defaultUnit === MeasuringUnit.lb ||
      (this.ingredient.defaultUnit === MeasuringUnit.us_cup &&
        this.datamapping.getIngredientType(this.ingredient.product) !== ProductType.fluid)) {
      this.measuringUnit = MeasuringUnit.gr;
    } else if (this.ingredient.defaultUnit === MeasuringUnit.us_cup) {
      this.measuringUnit = MeasuringUnit.ml;
    } else {
      this.measuringUnit = this.ingredient.defaultUnit;
    }
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
