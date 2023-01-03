import { SharedModule } from './../shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipiesContainer } from './recipies.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { RecipiesPageRoutingModule } from './recipies-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RecipiesPageRoutingModule,
    SharedModule
  ],
  declarations: [RecipiesContainer]
})
export class RecipiesPageModule {}
