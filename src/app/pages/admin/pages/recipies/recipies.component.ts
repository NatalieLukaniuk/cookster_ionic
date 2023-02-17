import { DataMappingService } from 'src/app/services/data-mapping.service';
import {
  Ingredient,
  MeasuringUnit,
  Product,
  Recipy,
} from './../../../../models/recipies.models';
import { TableService } from './../../services/table.service';
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { take, tap } from 'rxjs';
import { IAppState } from 'src/app/store/reducers';
import {
  getAllRecipies,
  getAllProducts,
} from 'src/app/store/selectors/recipies.selectors';
import {
  convertAmountToSelectedUnit,
  getDensity,
} from 'src/app/pages/recipies/utils/recipy.utils';
import * as _ from 'lodash';

@Component({
  selector: 'app-recipies',
  templateUrl: './recipies.component.html',
  styleUrls: ['./recipies.component.scss'],
})
export class RecipiesComponent implements OnInit {
  Object = Object;
  recipiesTableData: string[][] = [];
  recipies$ = this.store.pipe(
    select(getAllRecipies),
    tap((res) => {
      if (res.length) {
        this.recipiesTableData = this.tableService.buildRecipyTable(res);
      }
    })
  );
  products$ = this.store.pipe(select(getAllProducts));
  constructor(
    private store: Store<IAppState>,
    private tableService: TableService,
    private dataMapping: DataMappingService
  ) {}

  ngOnInit() {}

  runUpdate() {
    this.recipies$.pipe(take(1)).subscribe((res) => {
      this.recursiveUpdate(0, res);
    });
  }

  recursiveUpdate(i: number, recipies: Recipy[]) {
    if (i < recipies.length) {
      setTimeout(() => {
        let update = this.updateScript(recipies[i]);
        console.log(update);

        // this.store.dispatch(new UpdateRecipyAction(update));
        console.log(i + ' of ' + recipies.length);
        i++;
        this.recursiveUpdate(i, recipies);
      }, 1000);
    }
  }

  updateScript(recipy: Recipy): Recipy {
    let _recipy = _.cloneDeep(recipy);
    _recipy.ingrediends = recipy.ingrediends.map((ingred) => {
      if (this.unitsToFix.includes(ingred.defaultUnit)) {
        let _ingred = _.cloneDeep(ingred);
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
      this.dataMapping.products$.value
    );
    return this.transfToGr(
      ingr.product,
      inSelectedUnit,
      ingr.defaultUnit,
      this.dataMapping.products$.value
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
