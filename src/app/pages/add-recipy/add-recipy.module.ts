import { SharedModule } from '../../shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddRecipyPage } from './add-recipy.page';

import { AddRecipyPageRoutingModule } from './add-recipy-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AddRecipyPageRoutingModule,
    SharedModule
  ],
  declarations: [AddRecipyPage]
})
export class AddRecipyPageModule {}
