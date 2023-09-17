import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, combineLatest, map } from 'rxjs';
import { IAppState } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { ExpenseItem } from '../expenses-models';
import { FiltersService } from 'src/app/filters/services/filters.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-check-price-page',
  templateUrl: './check-price-page.component.html',
  styleUrls: ['./check-price-page.component.scss']
})
export class CheckPricePageComponent {
  expenses$: Observable<ExpenseItem[]> = this.store.pipe(select(getCurrentUser), map(user => {
    if (user && user.expenses?.length) {
      return user.expenses
    } else {
      return []
    }
  }))

  expenseItemsToDisplay$ = combineLatest([
    this.expenses$,
    this.filtersService.getFilters
  ]).pipe(
    map(res => _.cloneDeep(res)),
    map((res) => this.filtersService.applyFiltersToExpenses(res[0], res[1])),
  )

  constructor(
    private store: Store<IAppState>,
    private filtersService: FiltersService
  ) { }


}
