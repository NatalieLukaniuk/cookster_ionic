import { Component, Input, OnInit } from '@angular/core';
import { Day, MealTime } from 'src/app/models/calendar.models';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss'],
})
export class DayComponent implements OnInit {
  @Input() day!: Day;
  @Input() addRecipies!: boolean;

  MealTime = MealTime;
  constructor() {}

  ngOnInit() {}
}
