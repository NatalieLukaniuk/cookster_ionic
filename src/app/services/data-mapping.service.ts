import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Ingredient, MeasuringUnit, Product } from '../models/recipies.models';
import {
  getCalorificValue,
  getDefaultMeasuringUnit,
  getIngredientText,
  getProductById,
  getProductIdByName,
  getProductText,
  isIngrIncludedInAmountCalculation,
  transformToGr,
} from '../pages/recipies/utils/recipy.utils';
import { ProductsService } from './products.service';

@Injectable({
  providedIn: 'root',
})
export class DataMappingService {
  productsService = inject(ProductsService);

  $products = this.productsService.getProducts;

  constructor() {}

  getIngredientText(ingr: Ingredient): string {
    return getIngredientText(ingr, this.$products());
  }

  getProductNameById(id: string): string {
    return getProductText(id, this.$products());
  }

  getProductIdByName(name: string){
    return getProductIdByName(name, this.$products());
  }

  getProductById(id: string){
    return getProductById(id, this.$products())
  }

  getDefaultMU(id: string): MeasuringUnit {
    return getDefaultMeasuringUnit(id, this.$products());
  }

  getIsIngredientInDB(id: string) {
    return this.$products().find((ingr) => ingr.id == id);
  }

  getIsIngredientIncludedInAmountCalculation(ingr: Ingredient, isDrinkOrSoup: boolean): boolean {
    return isIngrIncludedInAmountCalculation(ingr, this.$products(), isDrinkOrSoup);
  }

  getCoeficient(
    ingredients: Ingredient[],
    portionsToServe: number,
    portionSize: number,
    isDrinkOrSoup: boolean
  ) {
    let amount = 0;
    for (let ingr of ingredients) {
      if (
        this.getIsIngredientInDB(ingr.product) &&
        this.getIsIngredientIncludedInAmountCalculation(ingr, isDrinkOrSoup)
      ) {
        amount = ingr.amount * this.getAmountChangeCoef(ingr.product) + amount; // amount of ingreds with calories
      }
    }

    return (portionsToServe * portionSize) / amount;
  }

  getAmountChangeCoef(ingrId: string): number {
    return this.$products().find((item) => ingrId === item.id)!
      .sizeChangeCoef;
  }

  transformToGr(ingrId: string, amount: number, unit: MeasuringUnit) {
    return transformToGr(ingrId, amount, unit, this.$products());
  }

  countRecipyCalorificValue(ingreds: Ingredient[]) {
    let calories = 0;
    let totalAmount = 0;
    ingreds.forEach((ingr) => {
      totalAmount += ingr.amount;
      calories += ingr.amount * getCalorificValue(ingr, this.$products());
    });
    return calories / totalAmount;
  }

  countRecipyTotalCalories(ingreds: Ingredient[]){
    let calories = 0;
    ingreds.forEach((ingr) => {
      calories += ingr.amount / 100 * getCalorificValue(ingr, this.$products());
    });
    return calories;
  }

  getIngredientType(ingrId: string){
    return this.$products().find((item) => ingrId === item.id)!
    .type;
  }
}
