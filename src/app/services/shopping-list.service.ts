import { inject, Injectable, signal } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { ShoppingList } from '../models/shopping-list.models';
import { getIsNewer } from '../pages/calendar/calendar.utils';
import { UserDataService } from './user-data.service';

const SHOPPING_LISTS_TIMESTAMPS = 'shopping-list-timestamp';

export interface ShoppingListTimestamp {
  name: string,
  lastUsed: string
}

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  userDataService = inject(UserDataService);

  private $shoppingTimestamps = signal<ShoppingListTimestamp[]>([]);
  shoppingListTimestamps = this.$shoppingTimestamps.asReadonly();

  updateShoppingList(list: ShoppingList[]) {
    this.userDataService.updateShoppingLists(list);
  }

  loadTimestamps() {
    this.getTimeStamps()
  }

  private getTimeStamps(): ShoppingListTimestamp[] | null {
    const returnValue = localStorage.getItem(SHOPPING_LISTS_TIMESTAMPS)
    if (returnValue) {
      const parsed = JSON.parse(returnValue)
      this.$shoppingTimestamps.set(parsed)
      return parsed
    } else {
      this.$shoppingTimestamps.set([])
      return null
    }
  }

  private setTimeStamps(data: ShoppingListTimestamp[]) {
    localStorage.setItem(SHOPPING_LISTS_TIMESTAMPS, JSON.stringify(data))
  }

  updateTimeStamp(list: ShoppingList) {

    this.$shoppingTimestamps.update(currentTimestamps => {
      if (!currentTimestamps) {
        return [{ name: list.name, lastUsed: new Date().toUTCString() }]
      } else if (!currentTimestamps.find(item => item.name === list.name)) {
        return currentTimestamps.concat([{ name: list.name, lastUsed: new Date().toUTCString() }])
      } else {
        return currentTimestamps.map(item => {
          if (item.name === list.name) {
            return { ...item, lastUsed: new Date().toUTCString() }
          } else return item
        })
      }
    })
    this.setTimeStamps(this.$shoppingTimestamps())

  }

  sortListByTimestamps(list: ShoppingList[], timestamps: ShoppingListTimestamp[]) {
    list.sort((a, b) => {
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
    return list;
  }
}
