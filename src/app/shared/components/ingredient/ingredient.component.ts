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
import { Component, computed, EventEmitter, inject, input, Input, OnInit, Output } from '@angular/core';
import { DataMappingService } from 'src/app/services/data-mapping.service';
import { ProductsService } from 'src/app/services/products.service';

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
  productsService = inject(ProductsService);

  ingredient = input.required<Ingredient>();
  coefficient = input.required<number>();
  startOptions = input<ItemOption[]>([]);
  endOptions = input<ItemOption[]>([]);

  @Output() emitEvent = new EventEmitter<ItemOptionActions>();

  measuringUnit: MeasuringUnit = MeasuringUnit.gr;
  MeasuringUnit = MeasuringUnit;

  $productType = computed(() => {
    return this.productsService.getProducts().find(product => product.id === this.ingredient().product)?.type || ProductType.hardItem;
  })

  $measurementUnits = computed(() => {
    switch (this.$productType()) {
      case ProductType.fluid:
        return this.filterOutForeignUnits(MeasuringUnitOptionsFluid);
      case ProductType.hardItem:
        return this.filterOutForeignUnits(MeasuringUnitOptionsHardItems);
      case ProductType.herb:
        return this.filterOutForeignUnits(MeasuringUnitOptionsHerbs);
      case ProductType.spice:
        return this.filterOutForeignUnits(MeasuringUnitOptionsSpice);
      case ProductType.granular:
        return this.filterOutForeignUnits(MeasuringUnitOptionsGranular);
      case ProductType.hardHomogenious:
        return this.filterOutForeignUnits(MeasuringUnitOptionsHardHomogeneous);
      default: return []
    }
  })

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
    if (this.ingredient().defaultUnit === MeasuringUnit.oz ||
      this.ingredient().defaultUnit === MeasuringUnit.lb ||
      (this.ingredient().defaultUnit === MeasuringUnit.us_cup &&
        this.datamapping.getIngredientType(this.ingredient().product) !== ProductType.fluid)) {
      this.measuringUnit = MeasuringUnit.gr;
    } else if (this.ingredient().defaultUnit === MeasuringUnit.us_cup) {
      this.measuringUnit = MeasuringUnit.ml;
    } else {
      this.measuringUnit = this.ingredient().defaultUnit;
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
