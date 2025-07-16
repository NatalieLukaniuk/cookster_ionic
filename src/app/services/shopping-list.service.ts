import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as _ from 'lodash';
import { BehaviorSubject, take } from 'rxjs';
import { UpdateUserAction } from '../store/actions/user.actions';
import { getCurrentUser } from '../store/selectors/user.selectors';
import { ShoppingList } from '../models/shopping-list.models';
import { getIsNewer } from '../pages/calendar/calendar.utils';

const SHOPPING_LISTS_TIMESTAMPS = 'shopping-list-timestamp';

export interface ShoppingListTimestamp {
  name: string,
  lastUsed: string
}

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  constructor(private store: Store) { }

  shoppingTimestamps$ = new BehaviorSubject<ShoppingListTimestamp[]>([])

  updateShoppingList(list: ShoppingList[]) {
    this.store.pipe(select(getCurrentUser), take(1)).subscribe((user) => {
      if (user) {
        let updatedUser = _.cloneDeep(user);
        updatedUser.shoppingLists = list;
        this.store.dispatch(
          new UpdateUserAction(updatedUser, `Список покупок оновлено`)
        );
      }
    });
  }

  loadTimestamps() {
    this.getTimeStamps()
  }

  private getTimeStamps(): ShoppingListTimestamp[] | null {
    const returnValue = localStorage.getItem(SHOPPING_LISTS_TIMESTAMPS)
    if (returnValue) {
      const parsed = JSON.parse(returnValue)
      this.shoppingTimestamps$.next(parsed)
      return parsed
    } else {
      this.shoppingTimestamps$.next([])
      return null
    }
  }

  private setTimeStamps(data: ShoppingListTimestamp[]) {
    localStorage.setItem(SHOPPING_LISTS_TIMESTAMPS, JSON.stringify(data))
  }

  updateTimeStamp(list: ShoppingList) {
    const currentTimestamps = this.shoppingTimestamps$.getValue();
    let updated: ShoppingListTimestamp[] = [];
    if (!currentTimestamps) {
      updated = [{ name: list.name, lastUsed: new Date().toUTCString() }]
    } else if (!currentTimestamps.find(item => item.name === list.name)) {
      updated = currentTimestamps.concat([{ name: list.name, lastUsed: new Date().toUTCString() }])
    } else {
      updated = currentTimestamps.map(item => {
        if (item.name === list.name) {
          return { ...item, lastUsed: new Date().toUTCString() }
        } else return item
      })
    }
    this.setTimeStamps(updated)
    this.shoppingTimestamps$.next(updated)
  }

  shoppingTimestampsObservable() {
    return this.shoppingTimestamps$.asObservable()
  }

    sortListByTimestamps(list: ShoppingList[], timestamps: ShoppingListTimestamp[]) {
      const updatedList = _.cloneDeep(list);
      updatedList.sort((a, b) => {
        const aTimestamp = timestamps.find(item => item.name === a.name)?.lastUsed;
        const bTimestamp = timestamps.find(item => item.name === b.name)?.lastUsed;
        if (!bTimestamp) {
          return -1
        } else if (!aTimestamp) {
          return 1
        } else {
          return getIsNewer(new Date(aTimestamp), new Date(bTimestamp)) ? -1 : 1;
        }
      })
  
      return updatedList;
    }

    getCurrentTimestamps(){
      return this.shoppingTimestamps$.getValue()
    }
}
