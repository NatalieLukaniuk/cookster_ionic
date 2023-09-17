import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, combineLatest, map, tap } from 'rxjs';
import { IAppState } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { ExpenseItem } from '../expenses-models';
import { FiltersService } from 'src/app/filters/services/filters.service';
import * as _ from 'lodash';
import { MeasuringUnit, MeasuringUnitOptions, MeasuringUnitText } from 'src/app/models/recipies.models';
import { DataMappingService } from 'src/app/services/data-mapping.service';
import { transformToGr } from 'src/app/pages/recipies/utils/recipy.utils';

@Component({
  selector: 'app-check-price-page',
  templateUrl: './check-price-page.component.html',
  styleUrls: ['./check-price-page.component.scss']
})
export class CheckPricePageComponent {
  expenses$: Observable<ExpenseItem[]> = this.store.pipe(select(getCurrentUser), map(user => {
    if (user && user.expenses?.length) {
      return user.expenses
    } else {
      return []
    }
  }))

  filteredExpenses: ExpenseItem[] = [];

  selectedMeasuringUnit: MeasuringUnit = MeasuringUnit.gr;
  selectedQuantity = 100;

  averagePrice = 0;

  isEditAverage = false;

  expenseItemsToDisplay$ = combineLatest([
    this.expenses$,
    this.filtersService.getFilters
  ]).pipe(
    map(res => _.cloneDeep(res)),
    map((res) => this.filtersService.applyFiltersToExpenses(res[0], res[1])),
    tap(res => this.filteredExpenses = res),
    tap(() => this.getAveragePrice())
  )

  constructor(
    private store: Store<IAppState>,
    private filtersService: FiltersService,
    private dataMapping: DataMappingService,
  ) { }

  getAveragePrice() {
    debugger
    const price = this.filteredExpenses.map(expense => this.getPricePerSelectedUnitAndQuantity(expense) * (expense.costPerHundredGrInHRN /100)).reduce((a, b) => a + b, 0);
    this.averagePrice = Math.round(price / this.filteredExpenses.length * 100) / 100;
  }

  getPricePerSelectedUnitAndQuantity(expense: ExpenseItem) {
    return transformToGr(expense.productId, +this.selectedQuantity, this.selectedMeasuringUnit,  this.dataMapping.products$.getValue())
  }

  getMeasuringUnitText(unit: MeasuringUnit) {
    return MeasuringUnitText[unit];
  }

  get measuringUnitsOptions() {
    return MeasuringUnitOptions
  }

}
