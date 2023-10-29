import { Injectable } from '@angular/core';
import { IAppState } from '../store/reducers';
import { Store, select } from '@ngrx/store';
import { ExpenseItem } from './expenses-models';
import { MeasuringUnit, MeasuringUnitText } from '../models/recipies.models';
import { DataMappingService } from '../services/data-mapping.service';
import { transformToGr } from '../pages/recipies/utils/recipy.utils';
import { getCurrentUser } from '../store/selectors/user.selectors';
import { Observable, map } from 'rxjs';
import { DatePipe, formatDate } from '@angular/common';

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

  getExpensesByTitle(allExpenses: ExpenseItem[], title: string) {
    const filteredData: ExpenseItem[] = allExpenses.filter(item => item.title.toLowerCase().includes(title.toLowerCase()));
    return filteredData
  }

  getExpensesByProduct(allExpenses: ExpenseItem[], id: string){
    const filteredData: ExpenseItem[] = allExpenses.filter(item => item.productId.toLowerCase().includes(id.toLowerCase()));
    return filteredData
  }

  getLowestPriceWithDetails(data: ExpenseItem[], isIncludeFullTitle = false) {
    let lowest = 100000;
    let foundItem: ExpenseItem | null = null;
    data.forEach(item => {
      if (item.costPerHundredGrInHRN < lowest) {
        lowest = item.costPerHundredGrInHRN;
        foundItem = item;
      }
    })
    return this.getItemDetails(foundItem, isIncludeFullTitle)
  }

  getItemDetails(item: ExpenseItem | null, isIncludeFullTitle = false) {
    if (!item) {
      return 'немає інформації'
    }
    if (item.productId !== 'other') {
      return Math.round(item.costPerHundredGrInHRN * 100) / 100 + 'грн/100гр ' + item.purchasePlace + ' ' + formatDate(item.purchaseDate, 'MMM dd, yy', 'en') + (isIncludeFullTitle? ' ' + item.title : '')
    } else {
      return item.cost + 'грн за ' + item.amount + ' ' + MeasuringUnitText[item.unit] + ' ' + item.purchasePlace + ' ' + formatDate(item.purchaseDate, 'MMM dd, yy', 'en');
    }
  }

  getHighestPriceWithDetails(data: ExpenseItem[], isIncludeFullTitle = false) {
    let highest = 0;
    let foundItem: ExpenseItem | null = null;
    data.forEach(item => {
      if (item.costPerHundredGrInHRN > highest) {
        highest = item.costPerHundredGrInHRN;
        foundItem = item;
      }
    })
    return this.getItemDetails(foundItem, isIncludeFullTitle)
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

  getExpenses(): Observable<ExpenseItem[]> {
    return this.store.pipe(select(getCurrentUser), map(user => {
      if (user && user.expenses?.length) {
        return user.expenses
      } else {
        return []
      }
    }))
  }

  getTitleOptions() {
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

  matchByProductId(title: string) {
    return this.dataMapping.getProductIdByName(title);
  }

  public getHighestPriceInfo(title:string){
    return this.getExpenses().pipe(map(allExpenses => {
      const matchedId = this.matchByProductId(title);

      const filtered = matchedId ? this.getExpensesByProduct(allExpenses, matchedId) : this.getExpensesByTitle(allExpenses, title);
      if (filtered) {
        const details = this.getHighestPriceWithDetails(filtered, !!matchedId);
        return details
      } else {
        return 'немає інформації'
      }
    }))
  }

  public getLowestPriceInfo(title: string){
    return this.getExpenses().pipe(map(allExpenses => {
      const matchedId = this.matchByProductId(title);
      const filtered = matchedId ? this.getExpensesByProduct(allExpenses, matchedId) : this.getExpensesByTitle(allExpenses, title);
      if (filtered) {
        const details = this.getLowestPriceWithDetails(filtered, !!matchedId);
        return details
      } else {
        return 'немає інформації'
      }
    }))
  }

}
