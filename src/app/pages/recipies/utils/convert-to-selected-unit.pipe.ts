import { DataMappingService } from './../../../services/data-mapping.service';
import { Pipe, PipeTransform } from '@angular/core';
import { MeasuringUnit } from 'src/app/models/recipies.models';
import { convertAmountToSelectedUnit } from './recipy.utils';

@Pipe({
  name: 'convertToSelectedUnit',
})
export class ConvertToSelectedUnitPipe implements PipeTransform {
  constructor(private datamapping: DataMappingService) {}

  transform(
    amountInGr: number,
    ingredientId: string,
    selectedUnit: MeasuringUnit
  ): any {
    return convertAmountToSelectedUnit(
      amountInGr,
      selectedUnit,
      ingredientId,
      this.datamapping.products$.value
    );
  }
}
