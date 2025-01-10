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
import { RecipyInCalendarSelectDateComponent } from './add-recipy-to-calendar-modal/recipy-in-calendar-select-date/recipy-in-calendar-select-date.component';
import { RecipyInCalendarSelectPortionsAndAmountComponent } from './add-recipy-to-calendar-modal/recipy-in-calendar-select-portions-and-amount/recipy-in-calendar-select-portions-and-amount.component';
import { FormsModule } from '@angular/forms';
import { CalendarDaySelectorComponent } from './calendar-day-selector/calendar-day-selector.component';



@NgModule({
  declarations: [CalendarComponent,
    CalendarTimelineDayComponent,
    RecipyPreviewComponent, AddRecipyToCalendarModalComponent, RecipyInCalendarShortViewComponent, RecipyInCalendarSelectDateComponent,
    RecipyInCalendarSelectPortionsAndAmountComponent,
    CalendarDaySelectorComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    FiltersModule,
    FormsModule
  ],
  exports: [CalendarComponent, AddRecipyToCalendarModalComponent, CalendarDaySelectorComponent]
})
export class CalendarModule { }
