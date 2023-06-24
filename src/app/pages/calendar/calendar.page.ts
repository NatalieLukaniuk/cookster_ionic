import { Component } from '@angular/core';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage {
  currentTab = 'menu'
  isPlannerMode = false;

  togglePlannerMode() {
    this.isPlannerMode = !this.isPlannerMode;
  }
}
