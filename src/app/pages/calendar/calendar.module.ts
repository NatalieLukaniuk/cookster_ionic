import { AdvancePreparationComponent } from './components/advance-preparation/advance-preparation.component';
import { AddRecipyModalComponent } from './components/add-recipy-modal/add-recipy-modal.component';
import { CalendarCoreComponent } from './components/calendar-core/calendar-core.component';
import { CalendarRecipyFullViewComponent } from './pages/calendar-recipy-full-view/calendar-recipy-full-view.component';
import { CalendarRecipyComponent } from './components/calendar-recipy/calendar-recipy.component';
import { CalendarMealComponent } from './components/calendar-meal/calendar-meal.component';
import { DayComponent } from './components/day/day.component';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarPageRoutingModule } from './calendar-routing.module';

import { CalendarPage } from './calendar.page';
import { ProductsPerDayComponent } from './components/products-per-day/products-per-day.component';
import { AddCommentModalComponent } from './components/add-comment-modal/add-comment-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarPageRoutingModule,
    SharedModule,
  ],
  declarations: [
    CalendarPage,
    DayComponent,
    CalendarMealComponent,
    CalendarRecipyComponent,
    CalendarRecipyFullViewComponent,
    CalendarCoreComponent,
    AddRecipyModalComponent,
    AdvancePreparationComponent,
    ProductsPerDayComponent,
    AddCommentModalComponent
  ],
  exports: [CalendarCoreComponent]
})
export class CalendarPageModule {}
