import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { IAppState } from 'src/app/store/reducers';
import { getExpenses } from 'src/app/store/selectors/expenses.selectors';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { getAllProducts } from 'src/app/store/selectors/recipies.selectors';
import { Product } from 'src/app/models/recipies.models';
import * as moment from 'moment';
import { DataMappingService } from 'src/app/services/data-mapping.service';
import { ExpenseItem } from '../expenses-models';

enum DisplayMode {
  LastMonth,
  HalfYear
}

@Component({
  selector: 'app-update-expenses',
  templateUrl: './update-expenses.component.html',
  styleUrls: ['./update-expenses.component.scss'],
})
export class UpdateExpensesComponent {

  expenses$ = this.store.pipe(select(getExpenses));
  products$ = this.store.pipe(select(getAllProducts));
  displayMode$ = new BehaviorSubject<DisplayMode>(DisplayMode.HalfYear)

  DisplayMode = DisplayMode;

  selectedProduct: Product | null | undefined = null;

  expensesToUpdate$ = combineLatest([
    this.expenses$,
    this.products$,
    this.displayMode$
  ]).pipe(
    map(([expenses, products, displayMode]) => {
      let productsNoCostForMonth: string[] = [];
      products.forEach((product: Product) => {
        const expensesPerProduct = expenses?.filter(expense => expense.productId === product.id);
        if (expensesPerProduct?.length) {
          let filtered = [];
          if (displayMode === DisplayMode.HalfYear) {
            filtered = this.filterForHalfYear(expensesPerProduct)
          } else {
            filtered = this.filterForMonth(expensesPerProduct)
          }
          if (!filtered.length) {
            productsNoCostForMonth.push(product.id)
          }
        } else {
          productsNoCostForMonth.push(product.id)
        }
      })
      return productsNoCostForMonth
    })
  )

  constructor(
    private store: Store<IAppState>,
    private datamapping: DataMappingService
  ) { }

  selectProduct(id: string): void {
    this.selectedProduct = this.datamapping.getProductById(id)
  }

  filterForMonth(expenses: ExpenseItem[]) {
    const today = new Date();
    const startOfMonth = moment(today).clone().subtract(1, 'month')
    const filtered = expenses.filter(expense => moment(expense.purchaseDate).isSameOrAfter(startOfMonth));
    return filtered
  }

  filterForHalfYear(expenses: ExpenseItem[]) {
    const today = new Date();
    const halfYearAgo = moment(today).clone().subtract(6, 'month')
    const filtered = expenses.filter(expense => moment(expense.purchaseDate).isSameOrAfter(halfYearAgo));
    return filtered
  }

  getProductName(id: string) {
    return this.datamapping.getProductNameById(id)
  }

  toggleDisplayMode() {
    const current = this.displayMode$.getValue();
    switch (current) {
      case DisplayMode.HalfYear: this.displayMode$.next(DisplayMode.LastMonth);
        break;
      case DisplayMode.LastMonth: this.displayMode$.next(DisplayMode.HalfYear)
    }
  }

}
