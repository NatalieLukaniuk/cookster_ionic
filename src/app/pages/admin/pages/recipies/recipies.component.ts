import {
  Ingredient,
  MeasuringUnit,
  Product,
  Recipy,
} from './../../../../models/recipies.models';
import { TableService } from './../../services/table.service';
import { Component, computed, inject } from '@angular/core';
import {
  convertAmountToSelectedUnit,
  getDensity,
} from 'src/app/pages/recipies/utils/recipy.utils';

import { RecipiesService } from 'src/app/services/recipies.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-recipies',
  templateUrl: './recipies.component.html',
  styleUrls: ['./recipies.component.scss'],
})
export class RecipiesComponent {
  recipiesService = inject(RecipiesService);
  productsService = inject(ProductsService);
  Object = Object;
  recipiesTableData = computed(() => this.tableService.buildRecipyTable(this.$recipies()));

  $recipies = this.recipiesService.getRecipies;
  $products = this.productsService.getProducts;

  constructor(
    private tableService: TableService
  ) {
  }


  runUpdate() {
    this.recursiveUpdate(0, this.$recipies());
  }

  recursiveUpdate(i: number, recipies: Recipy[]) {
    if (i < recipies.length) {
      setTimeout(() => {
        let update = this.updateScript(recipies[i]);
        console.log(update);

        // update function here
        console.log(i + ' of ' + recipies.length);
        i++;
        this.recursiveUpdate(i, recipies);
      }, 1000);
    }
  }

  updateScript(recipy: Recipy): Recipy {
    let _recipy = structuredClone(recipy);
    _recipy.ingrediends = recipy.ingrediends.map((ingred) => {
      if (this.unitsToFix.includes(ingred.defaultUnit)) {
        let _ingred = structuredClone(ingred);
        _ingred.amount = this.getFixedValue(_ingred);
        return _ingred;
      } else return ingred;
    });
    return _recipy;
  }

  unitsToFix = [
    MeasuringUnit.tableSpoon,
    MeasuringUnit.dessertSpoon,
    MeasuringUnit.teaSpoon,
    MeasuringUnit.coffeeSpoon,
  ];

  getFixedValue(ingr: Ingredient) {
    // фікс
    let inSelectedUnit = convertAmountToSelectedUnit(
      ingr.amount,
      ingr.defaultUnit,
      ingr.product,
      this.$products()
    );
    return this.transfToGr(
      ingr.product,
      inSelectedUnit,
      ingr.defaultUnit,
      this.$products()
    );
  }

  transfToGr(
    // трасформ в грами за новою схемою після фіксу
    ingrId: string,
    amount: number,
    unit: MeasuringUnit,
    allProducts: Product[]
  ) {
    return (amount * getDensity(ingrId, allProducts)) / this.getAmountInL(unit);
  }

  getAmountInL(unit: MeasuringUnit) {
    switch (unit) {
      case MeasuringUnit.l:
        return 1;
      case MeasuringUnit.ml:
        return 1000;
      case MeasuringUnit.tableSpoon:
        return 67;
      case MeasuringUnit.dessertSpoon:
        return 100;
      case MeasuringUnit.teaSpoon:
        return 203;
      case MeasuringUnit.cup:
        return 5;
      case MeasuringUnit.coffeeSpoon:
        return 405;
      default:
        return 1;
    }
  }
}
