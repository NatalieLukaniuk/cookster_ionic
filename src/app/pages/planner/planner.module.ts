import { CalendarPageModule } from './../calendar/calendar.module';
import { PlannerMainComponent } from './pages/planner-main/planner-main.component';
import { SharedModule } from '../../shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlannerPage } from './planner.page';

import { PlannerPageRoutingModule } from './planner-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PlannerPageRoutingModule,
    SharedModule,
    CalendarPageModule,
  ],
  declarations: [PlannerPage, PlannerMainComponent],
})
export class PlannerPageModule {}
