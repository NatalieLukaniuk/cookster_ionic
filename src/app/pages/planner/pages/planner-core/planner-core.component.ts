import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-planner-core',
  templateUrl: './planner-core.component.html',
  styleUrls: ['./planner-core.component.css']
})
export class PlannerCoreComponent {
  tabs = [
    {name: 'planning', icon: 'calendar-outline'},
    {name: 'shopping', icon: 'cart-outline'},
    {name: 'preps', icon: 'alarm-outline'},
  ]
  currentTab = this.tabs[0].name;

  onTabChange(event: any){
    this.currentTab = event.detail.value;
  }
}
