import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar-smart-wrapper/calendar.component';
import { CalendarTimelineDayComponent } from './calendar-timeline-day/calendar-timeline-day.component';
import { IonicModule } from '@ionic/angular';
import { RecipyPreviewComponent } from './recipy-preview/recipy-preview.component';
import { SharedModule } from '../shared/shared.module';
import { AddRecipyToCalendarModalComponent } from './add-recipy-to-calendar-modal/add-recipy-to-calendar-modal.component';
import { FiltersModule } from '../filters/filters.module';
import { RecipyInCalendarShortViewComponent } from './add-recipy-to-calendar-modal/recipy-in-calendar-short-view/recipy-in-calendar-short-view.component';



@NgModule({
  declarations: [CalendarComponent, CalendarTimelineDayComponent, RecipyPreviewComponent, AddRecipyToCalendarModalComponent, RecipyInCalendarShortViewComponent],
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    FiltersModule
  ],
  exports: [CalendarComponent, AddRecipyToCalendarModalComponent]
})
export class CalendarModule { }
