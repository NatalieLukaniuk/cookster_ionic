import { Component, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { IAppState } from 'src/app/store/reducers';
import { ExpenseItem } from '../expenses-models';
import * as _ from 'lodash';
import { getExpenses } from 'src/app/store/selectors/expenses.selectors';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
    selector: 'app-view-expenses-page',
    templateUrl: './view-expenses-page.component.html',
    styleUrls: ['./view-expenses-page.component.scss'],
    standalone: false
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
    private store: Store<IAppState>,
    private layoutService: LayoutService
  ) { }

  
  numberOfItemsToDisplay = this.layoutService.getIsBigScreen()? 20: 10;

  onIonInfinite(event: any){
    this.numberOfItemsToDisplay += 10;
    (event as InfiniteScrollCustomEvent).target.complete();
  }

  showGoTop = false;

  onscroll(event: any) {
    this.showGoTop = event.detail.scrollTop > 500;
  }

  @ViewChild('scrollingContainer') scrollingContainer: any;

  goTop() {
    this.scrollingContainer.scrollToTop()
  }
}
