import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar-smart-wrapper/calendar.component';
import { CalendarTimelineDayComponent } from './calendar-timeline-day/calendar-timeline-day.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [CalendarComponent, CalendarTimelineDayComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [CalendarComponent]
})
export class CalendarModule { }
