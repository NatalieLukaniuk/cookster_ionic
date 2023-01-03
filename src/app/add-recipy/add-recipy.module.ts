import { SharedModule } from './../shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddRecipyPage } from './add-recipy.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { AddRecipyPageRoutingModule } from './add-recipy-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    AddRecipyPageRoutingModule,
    SharedModule
  ],
  declarations: [AddRecipyPage]
})
export class AddRecipyPageModule {}
