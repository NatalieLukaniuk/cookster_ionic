import { AddIngredientComponent } from './components/add-ingredient/add-ingredient.component';
import { RecipyConstructorComponent } from './components/recipy-constructor/recipy-constructor.component';
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
  declarations: [AddRecipyPage, RecipyConstructorComponent, AddIngredientComponent]
})
export class AddRecipyPageModule {}
