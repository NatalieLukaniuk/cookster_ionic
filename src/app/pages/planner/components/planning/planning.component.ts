import { Component, Input } from '@angular/core';
import { PlannerByDate } from 'src/app/models/planner.models';
import * as moment from 'moment';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss'],
})
export class PlanningComponent{
  @Input() currentPlanner!: PlannerByDate;

  moment = moment;  
}
