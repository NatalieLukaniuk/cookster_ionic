import { PlannerByDate } from './../../../../models/planner.models';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.scss']
})
export class ShoppingComponent implements OnInit {
@Input() currentPlanner!: PlannerByDate;

  get isShoppingListActive(): boolean {
    return !!this.currentPlanner?.isShoppingListActive;
  }
  constructor() { }

  ngOnInit() {
  }

}
