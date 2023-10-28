import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, Observable, combineLatest, map, tap } from 'rxjs';
import { IAppState } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { ExpenseItem } from '../expenses-models';
import { FiltersService } from 'src/app/filters/services/filters.service';
import * as _ from 'lodash';
import { MeasuringUnit, MeasuringUnitOptions, MeasuringUnitText } from 'src/app/models/recipies.models';
import { DataMappingService } from 'src/app/services/data-mapping.service';
import { transformToGr } from 'src/app/pages/recipies/utils/recipy.utils';
import { Filters } from 'src/app/models/filters.models';

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

  searchWord$ = new BehaviorSubject<string>('');

  selectedMeasuringUnit: MeasuringUnit = MeasuringUnit.gr;
  selectedQuantity = 100;

  averagePrice = 0;
  lowestPrice = 0;
  highestPrice = 0;

  isEditAverage = false;

  expenseItemsToDisplay$ = combineLatest([
    this.expenses$,
    this.filtersService.getFilters,
    this.searchWord$
  ]).pipe(
    map(res => _.cloneDeep(res)),
    map(res => {
      const data: ExpenseItem[] = res[0];
      const searchword = res[2];
      if (searchword.length) {
        const filteredData: ExpenseItem[] = data.filter(item => item.title.toLowerCase().includes(searchword.toLowerCase()));
        const toReturn: [ExpenseItem[], Filters] = [filteredData, res[1]];
        return toReturn
      } else {
        const toReturn: [ExpenseItem[], Filters] = [data, res[1]];
        return toReturn
      }
    }),
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
    const price = this.filteredExpenses.map(expense => this.getInGramsPerSelectQuanityAndMeasuringUnit(expense) * (expense.costPerHundredGrInHRN / 100)).reduce((a, b) => a + b, 0);
    this.averagePrice = Math.round(price / this.filteredExpenses.length * 100) / 100;
    this.lowestPrice = this.getLowestPrice();
    this.highestPrice = this.getHighestPrice();
  }

  getInGramsPerSelectQuanityAndMeasuringUnit(expense: ExpenseItem) {
    return transformToGr(expense.productId, +this.selectedQuantity, this.selectedMeasuringUnit, this.dataMapping.products$.getValue())
  }

  getMeasuringUnitText(unit: MeasuringUnit) {
    return MeasuringUnitText[unit];
  }

  get measuringUnitsOptions() {
    return MeasuringUnitOptions
  }

  getIsBelowAverage(expense: ExpenseItem) {
    const pricePerSelected = this.getInGramsPerSelectQuanityAndMeasuringUnit(expense) * (expense.costPerHundredGrInHRN / 100)
    return pricePerSelected < this.averagePrice
  }

  getIsAboveAverage(expense: ExpenseItem) {
    const pricePerSelected = this.getInGramsPerSelectQuanityAndMeasuringUnit(expense) * (expense.costPerHundredGrInHRN / 100)
    return pricePerSelected > this.averagePrice
  }

  getLowestPrice() {
    let lowest = 100000;
    this.filteredExpenses.forEach(item => {
      if (item.costPerHundredGrInHRN < lowest) {
        lowest = item.costPerHundredGrInHRN
      }
    })
    return lowest
  }

  getHighestPrice() {
    let highest = 0;
    this.filteredExpenses.forEach(item => {
      if (item.costPerHundredGrInHRN > highest) {
        highest = item.costPerHundredGrInHRN
      }
    })
    return highest
  }

  getColor(expense: ExpenseItem) {
    return expense.costPerHundredGrInHRN === this.lowestPrice ? 'success' : expense.costPerHundredGrInHRN === this.highestPrice ? 'warning' : this.getIsBelowAverage(expense) ? 'light' : this.getIsAboveAverage(expense) ? 'medium' : 'secondary'
  }

  onSearch(event: any) {
    const searchword = event.detail.value;
    this.searchWord$.next(searchword);
  }

  clear() {
    this.searchWord$.next('');
  }

}
