import { Injectable } from '@angular/core';
import { IAppState } from '../store/reducers';
import { Store, select } from '@ngrx/store';
import { ExpenseItem } from './expenses-models';
import { Ingredient, MeasuringUnit, MeasuringUnitText } from '../models/recipies.models';
import { DataMappingService } from '../services/data-mapping.service';
import { transformToGr } from '../pages/recipies/utils/recipy.utils';
import { getCurrentUser } from '../store/selectors/user.selectors';
import { Observable, map, take } from 'rxjs';
import { DatePipe, formatDate } from '@angular/common';
import * as moment from 'moment';
import * as _ from 'lodash';
import { UpdateUserAction } from '../store/actions/user.actions';

export interface RecipyCostInfo {
  totalCost: number,
  warnings: string[],
  notReliable: boolean
}

@Injectable({
  providedIn: 'root'
})
export class ExpencesService {

  selectedQuantity = 100;
  selectedMeasuringUnit: MeasuringUnit = MeasuringUnit.gr;

  purchasePlacesWithNoVat = ['метро']

  constructor(private store: Store<IAppState>, private dataMapping: DataMappingService,) { }

  getAveragePrice(data: ExpenseItem[]) {
    const price = data.map(expense => this.getInGramsPerSelectQuanityAndMeasuringUnit(expense) * (expense.costPerHundredGrInHRN / 100)).reduce((a, b) => a + b, 0);
    return Math.round(price / data.length * 100) / 100;
  }

  getAveragePriceForLastMonth(data: ExpenseItem[]) {
    const today = new Date();
    const startOfMonth = moment(today).clone().subtract(1, 'month')
    const filtered = data.filter(expense => moment(expense.purchaseDate).isSameOrAfter(startOfMonth));
    return this.getAveragePrice(filtered)
  }

  getAveragePriceForHalfYear(data: ExpenseItem[]) {
    const today = new Date();
    const halfYearAgo = moment(today).clone().subtract(6, 'month')
    const filtered = data.filter(expense => moment(expense.purchaseDate).isSameOrAfter(halfYearAgo));
    return this.getAveragePrice(filtered)
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

  getExpensesByProduct(allExpenses: ExpenseItem[], id: string) {
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
      return Math.round(item.costPerHundredGrInHRN * 100) / 100 + 'грн/100гр ' + item.purchasePlace + ' ' + formatDate(item.purchaseDate, 'MMM dd, yy', 'en') + (isIncludeFullTitle ? ' ' + item.title : '')
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
        return user.expenses.map(expense => this.addVat(expense))
      } else {
        return []
      }
    }))
  }

  addVat(item: ExpenseItem) {
    if (this.purchasePlacesWithNoVat.includes(item.purchasePlace.toLowerCase())) {
      const updated = {
        ...item,
        costPerHundredGrInHRN: item.costPerHundredGrInHRN * 1.2
      }
      return updated
    } else {
      return item
    }
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

  public getHighestPriceInfo(title: string) {
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

  public getLowestPriceInfo(title: string) {
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

  getRecipyCost(
    ingredients: Ingredient[],
    portionsToServe: number,
    portionSize: number
  ): Observable<RecipyCostInfo> {
    const coef = this.dataMapping.getCoeficient(
      ingredients,
      portionsToServe,
      portionSize
    );

    const totalCostInfo: RecipyCostInfo = {
      totalCost: 0,
      warnings: [],
      notReliable: false
    };

    return this.getExpenses().pipe(map(
      (expensesData) => {
        let partWithNoData = 0;
        ingredients.forEach(ingredient => {
          const ingredientName = ingredient.ingredient ? ingredient.ingredient : this.dataMapping.getProductNameById(ingredient.product)
          const ingredExpenseInfo = this.getExpensesByProduct(expensesData, ingredient.product)
          if (!ingredExpenseInfo.length) {
            totalCostInfo.warnings.push(`${ingredientName}: немає даних`)
            const part = (ingredient.amount * coef) / (portionSize * portionsToServe);
            partWithNoData += part;
          } else {
            const averagePriceLastMonth = this.getAveragePriceForLastMonth(ingredExpenseInfo);
            if (averagePriceLastMonth) {
              const cost = averagePriceLastMonth / 100 * (ingredient.amount * coef)
              totalCostInfo.totalCost += cost
              totalCostInfo.warnings.push(`${ingredientName}: ${Math.round(cost * 100) / 100} грн`)
            } else {
              const averagePriceHalfYear = this.getAveragePriceForHalfYear(ingredExpenseInfo);
              if (averagePriceHalfYear) {
                const cost = averagePriceHalfYear / 100 * (ingredient.amount * coef);
                totalCostInfo.totalCost += cost
                totalCostInfo.warnings.push(`${ingredientName}: ${Math.round(cost * 100) / 100} грн. Дані за пів року`)
              } else {
                const averagePrice = this.getAveragePrice(ingredExpenseInfo);
                debugger
                const cost = averagePrice / 100 * (ingredient.amount * coef);
                totalCostInfo.totalCost += cost;
                if(cost === 0){
                  totalCostInfo.warnings.push(`${ingredientName}: 0 грн`)
                } else {
                  totalCostInfo.warnings.push(`${ingredientName}: ${Math.round(cost * 100) / 100} грн. Немає даних за останні пів року`)
                }
                
              }
            }
          }
        })
        if (partWithNoData >= .2) {
          totalCostInfo.notReliable = true;
        }
        return totalCostInfo;
      }
    ))
  }

  deleteExpenseItem(item: ExpenseItem) {
    this.store.pipe(select(getCurrentUser), take(1)).subscribe(user => {
      if (user && user.expenses) {
        const clonedUser = _.cloneDeep(user);
        let updated = {
          ...clonedUser,
          expenses: clonedUser.expenses?.filter(expense => !(expense.title === item.title && expense.productId === item.productId && expense.purchaseDate === item.purchaseDate && expense.purchasePlace === item.purchasePlace))
        }        
        this.store.dispatch(new UpdateUserAction(updated, `${item.title} deleted`))
      }
    })
  }
}
