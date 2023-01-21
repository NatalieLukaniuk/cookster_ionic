import { PrepsComponent } from './pages/preps/preps.component';
import { ShoppingComponent } from './pages/shopping/shopping.component';
import { PlannerCoreComponent } from './pages/planner-core/planner-core.component';
import { CalendarPageModule } from './../calendar/calendar.module';
import { PlanningComponent } from './pages/planning/planning.component';
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
  declarations: [
    PlannerPage,
    PlanningComponent,
    ViewRecipyComponent,
    PlannerCoreComponent,
    ShoppingComponent,
    PrepsComponent,
  ],
})
export class PlannerPageModule {}
