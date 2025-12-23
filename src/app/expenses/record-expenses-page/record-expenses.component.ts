import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { MeasuringUnit, MeasuringUnitOptions, MeasuringUnitText, Product, ProductType } from 'src/app/models/recipies.models';
import { IAppState } from 'src/app/store/reducers';
import { getAllProducts } from 'src/app/store/selectors/recipies.selectors';
import { Currency, CurrencyOptions, CurrencyText, ExpenseItem } from '../expenses-models';
import { transformToGr } from 'src/app/pages/recipies/utils/recipy.utils';
import { DataMappingService } from 'src/app/services/data-mapping.service';
import * as _ from 'lodash';
import { InputWithAutocompleteComponent } from 'src/app/shared/components/input-with-autocomplete/input-with-autocomplete.component';
import { ProductAutocompleteComponent } from 'src/app/shared/components/product-autocomplete/product-autocomplete.component';
import { getExpenses } from 'src/app/store/selectors/expenses.selectors';
import { AddExpenseAction } from 'src/app/store/actions/expenses.actions';

@Component({
  selector: 'app-record-expenses',
  templateUrl: './record-expenses.component.html',
  styleUrls: ['./record-expenses.component.scss']
})
export class RecordExpensesComponent {
  

  isModal = false;

  
}
