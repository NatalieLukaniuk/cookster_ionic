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
  

  ngOnInit() {}
}
