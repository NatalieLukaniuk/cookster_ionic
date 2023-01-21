import { PlannerCoreComponent } from './pages/planner-core/planner-core.component';
import { CalendarPageModule } from './../calendar/calendar.module';
import { PlannerMainComponent } from './pages/planner-main/planner-main.component';
import { SharedModule } from '../../shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlannerPage } from './planner.page';

import { PlannerPageRoutingModule } from './planner-routing.module';
import { ViewRecipyComponent } from './pages/view-recipy/view-recipy.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PlannerPageRoutingModule,
    SharedModule,
    CalendarPageModule,
  ],
  declarations: [PlannerPage, PlannerMainComponent, ViewRecipyComponent, PlannerCoreComponent],
})
export class PlannerPageModule {}
