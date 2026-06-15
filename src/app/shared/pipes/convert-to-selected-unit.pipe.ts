import { inject, Pipe, PipeTransform } from '@angular/core';
import { MeasuringUnit } from 'src/app/models/recipies.models';
import { convertAmountToSelectedUnit } from '../../pages/recipies/utils/recipy.utils';
import { ProductsService } from 'src/app/services/products.service';

@Pipe({
  name: 'convertToSelectedUnit',
})
export class ConvertToSelectedUnitPipe implements PipeTransform {
  productsService = inject(ProductsService)

  transform(
    amountInGr: number,
    ingredientId: string,
    selectedUnit: MeasuringUnit
  ): any {
    return convertAmountToSelectedUnit(
      amountInGr,
      selectedUnit,
      ingredientId,
      this.productsService.getProducts()
    );
  }
}
