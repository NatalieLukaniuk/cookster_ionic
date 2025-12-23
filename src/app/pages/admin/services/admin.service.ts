import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { Ingredient, MeasuringUnit, Product, Recipy } from 'src/app/models/recipies.models';
import { IAppState } from 'src/app/store/reducers';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { convertAmountToSelectedUnitRawData, transformToGrRawData } from '../../recipies/utils/recipy.utils';
import * as _ from 'lodash';
import { UpdateRecipyAction } from 'src/app/store/actions/recipies.actions';

const DENSITY_DEPENDENT_UNITS: MeasuringUnit[] = [
  MeasuringUnit.coffeeSpoon,
  MeasuringUnit.dessertSpoon,
  MeasuringUnit.tableSpoon,
  MeasuringUnit.teaSpoon,
  MeasuringUnit.ml,
  MeasuringUnit.l,
  MeasuringUnit.cup,
  MeasuringUnit.cl,
  MeasuringUnit.us_cup,
  MeasuringUnit.pinch
]
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private store: Store<IAppState>) { }

  getAllRecipies(): Observable<Recipy[]> {
    return this.store.pipe(select(getAllRecipies))
  }

  updateRecipiesOnDensityChange(productBeforeChange: Product, newDensity: number) {
    this.getAllRecipies().pipe(take(1)).subscribe(recipies => {
      const recipiesToUpdate = this.getRecipiesWithProductToUpdate(recipies, productBeforeChange);
      const interval = 4000; // Delay in milliseconds
      recipiesToUpdate.forEach((recipy, index) => {
        setTimeout(() => {
          this.updateRecipy(recipy, productBeforeChange, newDensity)
        }, index * interval);
      })
    })

  }

  getRecipiesWithProductToUpdate(recipies: Recipy[], product: Product) {
    return recipies.filter((recipy: Recipy) => recipy.ingrediends.find((ingr: Ingredient) => ingr.product === product.id && this.getShouldUpdateOnDensityChange(ingr)))
  }

  getShouldUpdateOnDensityChange(ingredient: Ingredient) {
    return DENSITY_DEPENDENT_UNITS.includes(ingredient.defaultUnit)
  }

  updateRecipy(recipy: Recipy, productBeforeChange: Product, newDensity: number) {
    const updated = _.cloneDeep(recipy)
    updated.ingrediends.forEach((ingr: Ingredient) => {
      if (ingr.product === productBeforeChange.id && this.getShouldUpdateOnDensityChange(ingr)) {
        const initialAmountInDefaultUnit = convertAmountToSelectedUnitRawData(ingr.amount, ingr.defaultUnit, productBeforeChange.density);
        const correctedGr = transformToGrRawData(initialAmountInDefaultUnit, ingr.defaultUnit, newDensity);
        ingr.amount = correctedGr;
      }
    })
    this.store.dispatch(new UpdateRecipyAction(updated))
  }
}
