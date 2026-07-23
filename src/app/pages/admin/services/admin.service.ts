import { inject, Injectable } from '@angular/core';
import { Ingredient, MeasuringUnit, Product, Recipy } from 'src/app/models/recipies.models';
import { convertAmountToSelectedUnitRawData, transformToGrRawData } from '../../recipies/utils/recipy.utils';

import { RecipiesService } from 'src/app/services/recipies.service';

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
recipiesService = inject(RecipiesService);

  $recipies = this.recipiesService.getRecipies;


  updateRecipiesOnDensityChange(productBeforeChange: Product, newDensity: number) {

      const recipiesToUpdate = this.getRecipiesWithProductToUpdate(this.$recipies(), productBeforeChange);
      const interval = 4000; // Delay in milliseconds
      recipiesToUpdate.forEach((recipy, index) => {
        setTimeout(() => {
          this.updateRecipy(recipy, productBeforeChange, newDensity)
        }, index * interval);
      })


  }

  getRecipiesWithProductToUpdate(recipies: Recipy[], product: Product) {
    return recipies.filter((recipy: Recipy) => recipy.ingrediends.find((ingr: Ingredient) => ingr.product === product.id && this.getShouldUpdateOnDensityChange(ingr)))
  }

  getShouldUpdateOnDensityChange(ingredient: Ingredient) {
    return DENSITY_DEPENDENT_UNITS.includes(ingredient.defaultUnit)
  }

  updateRecipy(recipy: Recipy, productBeforeChange: Product, newDensity: number) {
    const updated = structuredClone(recipy)
    updated.ingrediends.forEach((ingr: Ingredient) => {
      if (ingr.product === productBeforeChange.id && this.getShouldUpdateOnDensityChange(ingr)) {
        const initialAmountInDefaultUnit = convertAmountToSelectedUnitRawData(ingr.amount, ingr.defaultUnit, productBeforeChange.density);
        const correctedGr = transformToGrRawData(initialAmountInDefaultUnit, ingr.defaultUnit, newDensity);
        ingr.amount = correctedGr;
      }
    })
    this.recipiesService.updateRecipy(updated).subscribe()
  }
}
