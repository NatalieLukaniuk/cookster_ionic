import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { IAppState } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { ExpenseItem } from '../expenses-models';
import * as _ from 'lodash';

@Component({
  selector: 'app-view-expenses-page',
  templateUrl: './view-expenses-page.component.html',
  styleUrls: ['./view-expenses-page.component.scss']
})
export class ViewExpensesPageComponent {
  expenses$: Observable<ExpenseItem[]> = this.store.pipe(select(getCurrentUser), map(user => {
    if (user && user.expenses?.length) {
      const cloned = _.cloneDeep(user.expenses)
      return cloned.reverse()
    } else {
      return []
    }
  }))

  constructor(
    private store: Store<IAppState>
  ) { }

}
