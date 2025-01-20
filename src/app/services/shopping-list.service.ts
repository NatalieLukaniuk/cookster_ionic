import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as _ from 'lodash';
import { take } from 'rxjs';
import { UpdateUserAction } from '../store/actions/user.actions';
import { getCurrentUser } from '../store/selectors/user.selectors';
import { ShoppingList } from '../models/shopping-list.models';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  constructor(private store: Store) { }

  updateShoppingList(list: ShoppingList[]){
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
}
