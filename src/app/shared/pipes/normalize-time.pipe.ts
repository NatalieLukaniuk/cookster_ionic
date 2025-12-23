import { Pipe, PipeTransform } from '@angular/core';

const MINUTES_IN_DAY = 1440;

@Pipe({
  name: 'normalizeTime',
})
export class NormalizeTimePipe implements PipeTransform {
  transform(value: number, args?: any): string {
    if (value < 60) {
      return `${value}хв`;
    } else if (value < MINUTES_IN_DAY) {
      return value % 60
        ? `${Math.floor(value / 60)}год ${value % 60}хв`
        : `${Math.floor(value / 60)}год`;
    } else {
      let remainder = value % MINUTES_IN_DAY;
      return remainder % 60
        ? `${Math.floor(value / MINUTES_IN_DAY)}дн ${Math.floor(
            remainder / 60
          )}год ${remainder % 60}хв`
        : remainder
        ? `${Math.floor(value / MINUTES_IN_DAY)}дн ${Math.floor(
            remainder / 60
          )}год`
        : `${Math.floor(value / MINUTES_IN_DAY)}дн`;
    }
  }
}
