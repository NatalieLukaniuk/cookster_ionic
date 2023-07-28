import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShoppingListPage } from './shopping-list.page';
import { IngredientsForDatesArrayComponent } from './components/ingredients-for-dates-array/ingredients-for-dates-array.component';

const routes: Routes = [
  {
    path: '',
    component: ShoppingListPage
  },
  {
    path: 'dates/:dates',
    component: IngredientsForDatesArrayComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShoppingListPageRoutingModule {}
