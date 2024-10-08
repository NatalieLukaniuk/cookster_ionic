import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordExpensesComponent } from './record-expenses-page/record-expenses.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ExpensesRoutingModule } from './expenses-routing.module';
import { ViewExpensesPageComponent } from './view-expenses-page/view-expenses-page.component';
import { ViewExpenseItemComponent } from './components/view-expense-item/view-expense-item.component';
import { CheckPricePageComponent } from './check-price-page/check-price-page.component';
import { FiltersModule } from '../filters/filters.module';
import { UpdateExpensesComponent } from './update-expenses/update-expenses.component';
import { RecordExpenseFormComponent } from './record-expense-form/record-expense-form.component';



@NgModule({
  declarations: [RecordExpensesComponent, ViewExpensesPageComponent, ViewExpenseItemComponent, CheckPricePageComponent, UpdateExpensesComponent, RecordExpenseFormComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharedModule,
    ExpensesRoutingModule,
    FiltersModule
  ],
  exports: [
    RecordExpensesComponent
  ]
})
export class ExpensesModule { }
