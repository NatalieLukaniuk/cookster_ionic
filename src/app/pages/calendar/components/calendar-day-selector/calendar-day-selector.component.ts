import { Component } from '@angular/core';
import { CalendarReworkedService } from '../../calendar-reworked.service';

@Component({
    selector: 'app-calendar-day-selector',
    templateUrl: './calendar-day-selector.component.html',
    styleUrls: ['./calendar-day-selector.component.scss'],
    standalone: false
})
export class CalendarDaySelectorComponent {
  
  constructor(private calendarService: CalendarReworkedService) { }

  currentDay$ = this.calendarService.getCurrentDay();
  goPreviousDay() {
    const current = this.calendarService.getCurrentDayValue();
    const updated = current.subtract(1, 'day');
    this.calendarService.setCurrentDay(updated);
  }
  goNextDay() {
    const current = this.calendarService.getCurrentDayValue();
    const updated = current.add(1, 'day');
    this.calendarService.setCurrentDay(updated);
  }
}
