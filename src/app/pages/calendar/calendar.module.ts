import { SaveCalendarAsPdfPreviewComponent } from './components/save-calendar-as-pdf-preview/save-calendar-as-pdf-preview.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './components/calendar-smart-wrapper/calendar.component';
import { CalendarTimelineDayComponent } from './components/calendar-timeline-day/calendar-timeline-day.component';
import { IonicModule } from '@ionic/angular';
import { RecipyPreviewComponent } from './components/recipy-preview/recipy-preview.component';
import { SharedModule } from '../../shared/shared.module';
import { AddRecipyToCalendarModalComponent } from './components/add-recipy-to-calendar-modal/add-recipy-to-calendar-modal.component';
import { FiltersModule } from '../../filters/filters.module';
import { RecipyInCalendarShortViewComponent } from './components/add-recipy-to-calendar-modal/recipy-in-calendar-short-view/recipy-in-calendar-short-view.component';
import { RecipyInCalendarSelectDateComponent } from './components/add-recipy-to-calendar-modal/recipy-in-calendar-select-date/recipy-in-calendar-select-date.component';
import { RecipyInCalendarSelectPortionsAndAmountComponent } from './components/add-recipy-to-calendar-modal/recipy-in-calendar-select-portions-and-amount/recipy-in-calendar-select-portions-and-amount.component';
import { FormsModule } from '@angular/forms';
import { CalendarDaySelectorComponent } from './components/calendar-day-selector/calendar-day-selector.component';
import { ViewRecipiesComponent } from './components/view-recipies/view-recipies.component';
import { CalendarPage } from './calendar.page';
import { CommentsModule } from '../../comments/comments.module';
import { ProductsPerDayComponent } from './components/products-per-day/products-per-day.component';
import { AddCommentToCalendarModalComponent } from './components/add-comment-to-calendar-modal/add-comment-to-calendar-modal.component';
import { CalendarPageRoutingModule } from './calendar-routing.module';
import { CalendarTimelineRecipyComponent } from './components/calendar-timeline-recipy/calendar-timeline-recipy.component';
import { OpenedRecipiesGuardService } from './calendar.service';
import { CalendarPdfPreviewShortRecipyComponent } from './components/save-calendar-as-pdf-preview/calendar-pdf-preview-short-recipy/calendar-pdf-preview-short-recipy.component';



@NgModule({
  declarations: [CalendarComponent,
    CalendarTimelineDayComponent,
    RecipyPreviewComponent, AddRecipyToCalendarModalComponent, RecipyInCalendarShortViewComponent, RecipyInCalendarSelectDateComponent,
    RecipyInCalendarSelectPortionsAndAmountComponent,
    CalendarDaySelectorComponent,
    AddCommentToCalendarModalComponent,
    ViewRecipiesComponent,
    CalendarPage,
    ProductsPerDayComponent,
    CalendarTimelineRecipyComponent,
    CalendarPdfPreviewShortRecipyComponent,
    SaveCalendarAsPdfPreviewComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    CalendarPageRoutingModule,
    SharedModule,
    FiltersModule,
    FormsModule,
    CommentsModule
  ],
  providers: [OpenedRecipiesGuardService],
  exports: [CalendarComponent, AddRecipyToCalendarModalComponent, CalendarDaySelectorComponent, CalendarPage]
})
export class CalendarModule { }
