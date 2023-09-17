import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecordExpensesComponent } from './record-expenses-page/record-expenses.component';
import { ViewExpensesPageComponent } from './view-expenses-page/view-expenses-page.component';
import { CheckPricePageComponent } from './check-price-page/check-price-page.component';


const routes: Routes = [
  {
    path: 'record',
    component: RecordExpensesComponent,
  },  
  {
    path: 'view',
    component: ViewExpensesPageComponent,
  },
  {
    path: 'check-price',
    component: CheckPricePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpensesRoutingModule {}
