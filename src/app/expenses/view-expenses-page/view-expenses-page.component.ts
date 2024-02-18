import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { IAppState } from 'src/app/store/reducers';
import { ExpenseItem } from '../expenses-models';
import * as _ from 'lodash';
import { getExpenses } from 'src/app/store/selectors/expenses.selectors';

@Component({
  selector: 'app-view-expenses-page',
  templateUrl: './view-expenses-page.component.html',
  styleUrls: ['./view-expenses-page.component.scss']
})
export class ViewExpensesPageComponent {
  expenses$: Observable<ExpenseItem[]> = this.store.pipe(select(getExpenses), map(expenses => {
    if (expenses && expenses.length) {
      const cloned = _.cloneDeep(expenses)
      return cloned.reverse()
    } else {
      return []
    }
  }))

  constructor(
    private store: Store<IAppState>
  ) { }

}
