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
  ],
})
export class CalendarPageModule {}
