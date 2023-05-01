import { Component, OnInit } from '@angular/core';
import {
  MeasuringUnit,
  MeasuringUnitOptionsFluid,
  MeasuringUnitText,
} from 'src/app/models/recipies.models';
import { getAmountInL } from 'src/app/pages/recipies/utils/recipy.utils';

@Component({
  selector: 'app-density-calc',
  templateUrl: './density-calc.component.html',
  styleUrls: ['./density-calc.component.scss'],
})
export class DensityCalcComponent implements OnInit {
  MeasuringUnitOptions = MeasuringUnitOptionsFluid.filter(
    (unit) =>
      unit !== MeasuringUnit.gr &&
      unit !== MeasuringUnit.none &&
      unit !== MeasuringUnit.coffeeSpoon
  );

  selectedUnit: MeasuringUnit = MeasuringUnit.teaSpoon;

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

  ngOnInit() {}
}
