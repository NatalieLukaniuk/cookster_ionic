import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DraftRecipiesPageRoutingModule } from './draft-recipies-routing.module';

import { DraftRecipiesPage } from './draft-recipies.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DraftRecipiesPageRoutingModule,
    SharedModule
  ],
  declarations: [DraftRecipiesPage]
})
export class DraftRecipiesPageModule {}
