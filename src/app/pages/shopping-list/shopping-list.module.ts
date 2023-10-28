import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShoppingListPageRoutingModule } from './shopping-list-routing.module';

import { ShoppingListPage } from './shopping-list.page';
import { IngredientsForDatesArrayComponent } from './components/ingredients-for-dates-array/ingredients-for-dates-array.component';
import { ExpensesModule } from 'src/app/expenses/expenses.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShoppingListPageRoutingModule,
    SharedModule,
    ExpensesModule
  ],
  declarations: [ShoppingListPage, IngredientsForDatesArrayComponent]
})
export class ShoppingListPageModule {}
