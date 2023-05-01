import { AddPrepModalComponent } from './components/add-prep-modal/add-prep-modal.component';
import { AddToListModalComponent } from './components/add-to-list-modal/add-to-list-modal.component';
import { NormalizeDisplayedAmountPipe } from './../../shared/pipes/normalize-displayed-amount.pipe';
import { PrepsComponent } from './components/preps/preps.component';
import { ShoppingComponent } from './components/shopping/shopping.component';
import { PlannerCoreComponent } from './pages/planner-core/planner-core.component';
import { CalendarPageModule } from './../calendar/calendar.module';
import { PlanningComponent } from './components/planning/planning.component';
import { SharedModule } from '../../shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlannerPage } from './planner.page';

import { PlannerPageRoutingModule } from './planner-routing.module';
import { ViewRecipyComponent } from './pages/view-recipy/view-recipy.component';
import { ConvertToSelectedUnitPipe } from 'src/app/shared/pipes/convert-to-selected-unit.pipe';

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
    AddToListModalComponent,
    AddPrepModalComponent,
  ],
  providers: [NormalizeDisplayedAmountPipe, ConvertToSelectedUnitPipe],
})
export class PlannerPageModule {}
