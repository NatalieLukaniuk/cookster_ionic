import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExpenseItem } from '../expenses/expenses-models';
import * as _ from 'lodash';
import { Store, select } from '@ngrx/store';
import { IAppState } from '../store/reducers';
import { getExpenses } from '../store/selectors/expenses.selectors';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpensesApiService {
  userCooksterId = '';

  url = `https://cookster-12ac8-default-rtdb.firebaseio.com/expenses`;

  userExpenses: ExpenseItem[] = [];

  getExpenses() {
    this.store.pipe(select(getExpenses)).subscribe(res => {
      if (res) {
        this.userExpenses = res
      }
    })
    return this.http.get<{ expenses: ExpenseItem[] }>(`${this.url}/${this.userCooksterId}.json`)
  }

  addExpense(newItem: ExpenseItem) {
    let clonedExpenses = _.cloneDeep(this.userExpenses);
    if (clonedExpenses) {
      clonedExpenses = clonedExpenses.filter(item => !!item);
      clonedExpenses.push(newItem)
    } else {
      clonedExpenses = [newItem]
    }
    return this.http.patch<{ name: string }>(`${this.url}/${this.userCooksterId}.json`, { expenses: clonedExpenses }).pipe(map(() => clonedExpenses));
  }

  filterOutItemToDelete(item: ExpenseItem, expenses: ExpenseItem[]) {
    let updated = expenses.filter(expense => !(expense.title === item.title && expense.productId === item.productId && expense.purchaseDate === item.purchaseDate && expense.purchasePlace === item.purchasePlace))
    return updated
  }

  removeExpense(item: ExpenseItem) {
    const updated = this.filterOutItemToDelete(item, this.userExpenses)
    return this.http.patch<{ name: string }>(`${this.url}/${this.userCooksterId}.json`, { expenses: updated }).pipe(map(() => updated));
  }


  constructor(private http: HttpClient, private store: Store<IAppState>) { }

}
