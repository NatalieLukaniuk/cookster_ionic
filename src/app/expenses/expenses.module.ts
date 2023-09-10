import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordExpensesComponent } from './record-expenses-page/record-expenses.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ExpensesRoutingModule } from './expenses-routing.module';



@NgModule({
  declarations: [RecordExpensesComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharedModule,
    ExpensesRoutingModule
  ]
})
export class ExpensesModule { }
