import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecordExpensesComponent } from './record-expenses-page/record-expenses.component';
import { ViewExpensesPageComponent } from './view-expenses-page/view-expenses-page.component';


const routes: Routes = [
  {
    path: 'record',
    component: RecordExpensesComponent,
  },  
  {
    path: 'view',
    component: ViewExpensesPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpensesRoutingModule {}
