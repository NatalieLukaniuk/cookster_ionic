import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Ingredient, MeasuringUnit, Product } from '../models/recipies.models';
import {
  getDefaultMeasuringUnit,
  getIngredientText,
  getProductText,
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
}
