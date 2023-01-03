import { SharedModule } from '../../shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipiesContainer } from './recipies.page';

import { RecipiesPageRoutingModule } from './recipies-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RecipiesPageRoutingModule,
    SharedModule
  ],
  declarations: [RecipiesContainer]
})
export class RecipiesPageModule {}
