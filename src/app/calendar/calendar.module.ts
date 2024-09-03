import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar-smart-wrapper/calendar.component';



@NgModule({
  declarations: [CalendarComponent],
  imports: [
    CommonModule
  ],
  exports: [CalendarComponent]
})
export class CalendarModule { }
