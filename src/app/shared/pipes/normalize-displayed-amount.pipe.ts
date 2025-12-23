import { Pipe, PipeTransform } from '@angular/core';
import { MeasuringUnit } from 'src/app/models/recipies.models';
import { NormalizeDisplayedAmount } from '../../pages/recipies/utils/recipy.utils';

@Pipe({
    name: 'normalizeDisplayedAmount',
    standalone: false
})
export class NormalizeDisplayedAmountPipe implements PipeTransform {
  transform(realAmount: number, unit: MeasuringUnit): any {
    return NormalizeDisplayedAmount(realAmount, unit);
  }
}
