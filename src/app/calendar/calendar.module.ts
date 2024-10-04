import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar-smart-wrapper/calendar.component';
import { CalendarTimelineDayComponent } from './calendar-timeline-day/calendar-timeline-day.component';
import { IonicModule } from '@ionic/angular';
import { RecipyPreviewComponent } from './recipy-preview/recipy-preview.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [CalendarComponent, CalendarTimelineDayComponent, RecipyPreviewComponent],
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
  ],
  exports: [CalendarComponent]
})
export class CalendarModule { }
