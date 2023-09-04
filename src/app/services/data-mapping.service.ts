import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Ingredient, MeasuringUnit, Product } from '../models/recipies.models';
import {
  getCalorificValue,
  getDefaultMeasuringUnit,
  getIngredientText,
  getProductText,
  isIngrIncludedInAmountCalculation,
  transformToGr,
} from '../pages/recipies/utils/recipy.utils';

@Injectable({
  providedIn: 'root',
})
export class DataMappingService {
  products$ = new BehaviorSubject<Product[]>([]);

  constructor() {}

  getIngredientText(ingr: Ingredient): string {
    return getIngredientText(ingr, this.products$.value);
  }

  getProductNameById(id: string): string {
    return getProductText(id, this.products$.value);
  }

  getDefaultMU(id: string): MeasuringUnit {
    return getDefaultMeasuringUnit(id, this.products$.value);
  }

  getIsIngredientInDB(id: string) {
    return this.products$.value.find((ingr) => ingr.id == id);
  }

  getIsIngredientIncludedInAmountCalculation(ingr: Ingredient): boolean {
    return isIngrIncludedInAmountCalculation(ingr, this.products$.value);
  }

  getCoeficient(
    ingredients: Ingredient[],
    portionsToServe: number,
    portionSize: number
  ) {
    let amount = 0;
    for (let ingr of ingredients) {
      if (
        this.getIsIngredientInDB(ingr.product) &&
        this.getIsIngredientIncludedInAmountCalculation(ingr)
      ) {
        amount = ingr.amount * this.getAmountChangeCoef(ingr.product) + amount; // amount of ingreds with calories
      }
    }

    return (portionsToServe * portionSize) / amount;
  }

  getAmountChangeCoef(ingrId: string): number {
    return this.products$.value.find((item) => ingrId === item.id)!
      .sizeChangeCoef;
  }

  transformToGr(ingrId: string, amount: number, unit: MeasuringUnit) {
    return transformToGr(ingrId, amount, unit, this.products$.value);
  }

  countRecipyCalorificValue(ingreds: Ingredient[]) {
    let calories = 0;
    let totalAmount = 0;
    ingreds.forEach((ingr) => {
      totalAmount += ingr.amount;
      calories += ingr.amount * getCalorificValue(ingr, this.products$.value);
    });
    return calories / totalAmount;
  }

  countRecipyTotalCalories(ingreds: Ingredient[]){
    let calories = 0;
    ingreds.forEach((ingr) => {
      calories += ingr.amount / 100 * getCalorificValue(ingr, this.products$.value);
    });
    return calories;
  }

  getIngredientType(ingrId: string){
    return this.products$.value.find((item) => ingrId === item.id)!
    .type;
  }
}
