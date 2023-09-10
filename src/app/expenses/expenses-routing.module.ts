import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecordExpensesComponent } from './record-expenses-page/record-expenses.component';


const routes: Routes = [
  {
    path: 'record',
    component: RecordExpensesComponent,
  },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpensesRoutingModule {}
