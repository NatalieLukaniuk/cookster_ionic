import { PlannerByDate } from 'src/app/models/planner.models';
import {
  ShoppingList,
  ShoppingListItem,
  SLItem,
} from './../../models/planner.models';
import { map, Subject, takeUntil } from 'rxjs';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { IAppState } from 'src/app/store/reducers';
import { PlannerService } from 'src/app/services/planner.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.page.html',
  styleUrls: ['./shopping-list.page.scss'],
})
export class ShoppingListPage implements OnInit, OnDestroy {
  destroyed$ = new Subject<void>();
  activeList: ShoppingList[] | undefined;
  planner: PlannerByDate | undefined;

  activeList$ = this.store.pipe(
    select(getCurrentUser),
    takeUntil(this.destroyed$),
    map((user) => {
      if (user) {
        this.planner = user.planner?.find(
          (planner) => planner.isShoppingListActive
        );
        let list = this.planner!.shoppingLists;
        this.activeList = list!;
        return list;
      } else return [];
    })
  );

  tabs = [
    { name: 'купити', icon: 'calendar-outline' },
    { name: 'куплені', icon: 'cart-outline' },
  ];
  currentTab = this.tabs[0].name;

  constructor(
    private store: Store<IAppState>,
    private plannerService: PlannerService
  ) {}

  ngOnInit() {}

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  getAmountInList(item: ShoppingListItem): string | undefined {
    let ls = this.activeList!.find((list) =>
      list.items.find((ingr) => ingr.title == item.title)
    );
    if (ls) {
      return ls.items.find((ingr) => ingr.title == item.title)?.amount;
    } else return undefined;
  }

  onTabChange(event: any) {
    this.currentTab = event.detail.value;
  }

  hasNotBought(list: ShoppingList) {
    return list.items.some((item) => !item.completed);
  }

  hasBought(list: ShoppingList) {
    return list.items.some((item) => item.completed);
  }

  onSwiped(item: ShoppingListItem, list: string) {
    let cloned = _.cloneDeep(this.activeList);
    let updatedList: ShoppingList[] = cloned!.map((ls: ShoppingList) => {
      if (ls.name === list) {
        ls.items = ls.items.map((ingr: ShoppingListItem) => {
          if (ingr.title === item.title) {
            ingr.completed = !ingr.completed;
          }
          return ingr;
        });
      }
      return ls;
    });
    this.plannerService.updateShoppingLists(updatedList, this.planner!);
  }
}
