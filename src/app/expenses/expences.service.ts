import { Injectable } from '@angular/core';
import { IAppState } from '../store/reducers';
import { Store, select } from '@ngrx/store';
import { ExpenseItem } from './expenses-models';
import { MeasuringUnit } from '../models/recipies.models';
import { DataMappingService } from '../services/data-mapping.service';
import { transformToGr } from '../pages/recipies/utils/recipy.utils';
import { getCurrentUser } from '../store/selectors/user.selectors';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpencesService {

  selectedQuantity = 100;
  selectedMeasuringUnit: MeasuringUnit = MeasuringUnit.gr;

  constructor(private store: Store<IAppState>, private dataMapping: DataMappingService,) { }

  getAveragePrice(data: ExpenseItem[]) {
    const price = data.map(expense => this.getInGramsPerSelectQuanityAndMeasuringUnit(expense) * (expense.costPerHundredGrInHRN / 100)).reduce((a, b) => a + b, 0);
    return Math.round(price / data.length * 100) / 100;
  }

  getInGramsPerSelectQuanityAndMeasuringUnit(expense: ExpenseItem) {
    return transformToGr(expense.productId, +this.selectedQuantity, this.selectedMeasuringUnit, this.dataMapping.products$.getValue())
  }

  getLowestPrice(data: ExpenseItem[]) {
    let lowest = 100000;
    data.forEach(item => {
      if (item.costPerHundredGrInHRN < lowest) {
        lowest = item.costPerHundredGrInHRN
      }
    })
    return lowest
  }

  getHighestPrice(data: ExpenseItem[]) {
    let highest = 0;
    data.forEach(item => {
      if (item.costPerHundredGrInHRN > highest) {
        highest = item.costPerHundredGrInHRN
      }
    })
    return highest
  }

  getExpenses(): Observable<ExpenseItem[]>{
    return this.store.pipe(select(getCurrentUser), map(user => {
      if (user && user.expenses?.length) {
        return user.expenses
      } else {
        return []
      }
    }))
  }

  getTitleOptions(){
    return this.store.pipe(select(getCurrentUser), map(user => {
      if (user && user.expenses?.length) {
        return this.getUnique(user.expenses.map(expense => expense.title))
      } else {
        return []
      }
    }))
  }

  getUnique(array: string[]): string[] {
    const unique = new Set();
    array.forEach(item => unique.add(item));
    return Array.from(unique.values()) as string[];
  }
}
