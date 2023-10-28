import { Injectable } from '@angular/core';
import { IAppState } from '../store/reducers';
import { Store } from '@ngrx/store';
import { ExpenseItem } from './expenses-models';
import { MeasuringUnit } from '../models/recipies.models';
import { DataMappingService } from '../services/data-mapping.service';
import { transformToGr } from '../pages/recipies/utils/recipy.utils';

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
}
