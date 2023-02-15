import { take } from 'rxjs/operators';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as _ from 'lodash';
import { PlannerByDate, ShoppingList } from '../models/planner.models';
import { UpdateUserAction } from '../store/actions/user.actions';

@Injectable({
  providedIn: 'root',
})
export class PlannerService {
  constructor(private store: Store) {}

  addPlannerByDate(planner: PlannerByDate) {
    this.store.pipe(select(getCurrentUser), take(1)).subscribe((user) => {
      if (user) {
        let updatedUser = _.cloneDeep(user);
        if (!updatedUser.planner) {
          updatedUser.planner = [];
        }
        updatedUser.planner.push(planner);
        this.store.dispatch(
          new UpdateUserAction(updatedUser, `Планер створено`)
        );
      }
    });
  }

  updatePlannerByDate(planner: PlannerByDate) {
    this.store.pipe(select(getCurrentUser), take(1)).subscribe((user) => {
      if (user && user.planner) {
        let updatedUser = _.cloneDeep(user);
        updatedUser.planner = updatedUser.planner!.map((plannerByDate) => {
          if (plannerByDate.id == planner.id) {
            return planner;
          } else return plannerByDate;
        });
        this.store.dispatch(
          new UpdateUserAction(updatedUser, `Планер оновлено`)
        );
      }
    });
  }

  removePlannerByDate(planner: PlannerByDate) {
    this.store.pipe(select(getCurrentUser), take(1)).subscribe((user) => {
      if (user && user.planner) {
        let updatedUser = _.cloneDeep(user);
        updatedUser.planner = updatedUser.planner!.filter(
          (plannerByDate) => plannerByDate.id !== planner.id
        );
        this.store.dispatch(
          new UpdateUserAction(updatedUser, `Планер видалено`)
        );
      }
    });
  }

  updateShoppingLists(lists: ShoppingList[], planner: PlannerByDate) {
    let updated = _.cloneDeep(planner);
    updated.shoppingLists = lists;
    this.updatePlannerByDate(updated);
  }

  removeShoppingList(list: ShoppingList, planner: PlannerByDate) {
    let updatedPlanner = _.cloneDeep(planner);
    updatedPlanner.shoppingLists = updatedPlanner.shoppingLists.filter(
      (item) => item.name !== list.name
    );
    this.updatePlannerByDate(updatedPlanner);
  }

  addShoppingList(list: ShoppingList, planner: PlannerByDate) {
    let updated = { ...planner };
    if (updated.shoppingLists) {
      updated.shoppingLists = [...updated.shoppingLists, list];
    } else {
      updated.shoppingLists = [list];
    }

    this.updatePlannerByDate(updated);
  }

  makeShoppingListActive(planner: PlannerByDate) {
    this.store.pipe(select(getCurrentUser), take(1)).subscribe((user) => {
      if (user && user.planner?.length) {
        let updatedUser = _.cloneDeep(user);
        updatedUser.planner = updatedUser.planner!.map((list) => {
          if (list.id == planner.id) {
            return {
              ...list,
              isShoppingListActive: true,
            };
          } else {
            return {
              ...list,
              isShoppingListActive: false,
            };
          }
        });
        this.store.dispatch(
          new UpdateUserAction(updatedUser, `Список покупок тепер активний`)
        );
      }
    });
  }
}
