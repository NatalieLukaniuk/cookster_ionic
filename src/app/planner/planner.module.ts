import { SharedModule } from './../shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlannerPage } from './planner.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { PlannerPageRoutingModule } from './planner-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    PlannerPageRoutingModule,
    SharedModule
  ],
  declarations: [PlannerPage]
})
export class PlannerPageModule {}
