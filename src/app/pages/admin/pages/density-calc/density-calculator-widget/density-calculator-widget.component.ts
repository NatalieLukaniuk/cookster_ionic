import { Component, Input, OnInit } from '@angular/core';
import { MeasuringUnitOptionsFluid, MeasuringUnit, MeasuringUnitText } from 'src/app/models/recipies.models';
import { getAmountInL } from 'src/app/pages/recipies/utils/recipy.utils';

@Component({
    selector: 'app-density-calculator-widget',
    templateUrl: './density-calculator-widget.component.html',
    styleUrls: ['./density-calculator-widget.component.scss'],
    standalone: false
})
export class DensityCalculatorWidgetComponent  implements OnInit {

  @Input() isCheckMode = false;
  @Input() presetDensity = 0;

  MeasuringUnitOptions = MeasuringUnitOptionsFluid.filter(
    (unit) =>
      unit !== MeasuringUnit.gr &&
      unit !== MeasuringUnit.none &&
      unit !== MeasuringUnit.coffeeSpoon
  );

  selectedUnit: MeasuringUnit = MeasuringUnit.tableSpoon;

  getMeasuringUnitText(unit: MeasuringUnit) {
    return MeasuringUnitText[unit];
  }

  quantityInSelectedUnit: number = 1;
  quantityInGr: number = 1;

  constructor() {}

  get density() {
    return (
      (this.quantityInGr * getAmountInL(this.selectedUnit)) /
      this.quantityInSelectedUnit
    );
  }

  get calculatedGr(){
    return Math.round(this.presetDensity * this.quantityInSelectedUnit / getAmountInL(this.selectedUnit))
  }

  ngOnInit() {}

}
