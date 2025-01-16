import {
  ShoppingList,
  ShoppingListItem,
} from './../../models/planner.models';
import { map, Subject, takeUntil } from 'rxjs';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { IAppState } from 'src/app/store/reducers';
import * as _ from 'lodash';
import { IonModal, ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { ShoppingListService } from 'src/app/services/shopping-list.service';
import { Router } from '@angular/router';
import { DialogsService } from 'src/app/services/dialogs.service';
import { ControllerInputDialogComponent } from 'src/app/shared/components/dialogs/controller-input-dialog/controller-input-dialog.component';
import { ControllerListSelectDialogComponent } from 'src/app/shared/components/dialogs/controller-list-select-dialog/controller-list-select-dialog.component';
import { RecordExpensesComponent } from 'src/app/expenses/record-expenses-page/record-expenses.component';
import { ExpencesService } from 'src/app/expenses/expences.service';
import { AddToListModalComponent } from './components/add-to-list-modal/add-to-list-modal.component';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.page.html',
  styleUrls: ['./shopping-list.page.scss'],
})
export class ShoppingListPage implements OnInit, OnDestroy {
  destroyed$ = new Subject<void>();
  activeList: ShoppingList[] | undefined;

  activeList$ = this.store.pipe(
    select(getCurrentUser),
    takeUntil(this.destroyed$),
    map((user) => {
      if (user && user.shoppingLists) {
        this.activeList = user.shoppingLists;
        return user.shoppingLists;
      } else return [];
    })
  );

  tabs = [
    { name: 'купити', icon: 'calendar-outline' },
    { name: 'куплені', icon: 'cart-outline' },
  ];
  currentTab = this.tabs[0].name;

  isRecordExpenseOnBought = false;

  constructor(
    private store: Store<IAppState>,
    private shoppingListService: ShoppingListService,
    private modalCtrl: ModalController,
    private router: Router,
    private dialog: DialogsService,
    private expensesService: ExpencesService
  ) { }

  ngOnInit() { }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  onTabChange(event: any) {
    this.currentTab = event.detail.value;
  }

  hasNotBought(list: ShoppingList) {
    return list.items?.some((item) => !item.completed);
  }

  hasBought(list: ShoppingList) {
    return list.items?.some((item) => item.completed);
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
    this.shoppingListService.updateShoppingList(updatedList);
    if (this.isRecordExpenseOnBought && !item.completed) {
      this.recordPrice(item)
    }
  }

  async addCustomItem() {
    let cloned = _.cloneDeep(this.activeList);
    const modal = await this.modalCtrl.create({
      component: AddToListModalComponent,
      componentProps: {
        ingredient: {},
        lists: cloned,
        isPlannedIngredient: false,
      },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.shoppingListService.updateShoppingList(data);
    }
  }

  removeBought() {
    this.dialog
      .openConfirmationDialog(
        `Очистити список куплених інгридієнтів?`,
        'Ця дія незворотня'
      )
      .then((res) => {
        if (res.role === 'confirm') {
          const list = this.activeList?.map(listItem => {
            const updated = {
              ...listItem,
              items: listItem.items?.filter(item => !item.completed)
            }
            return updated
          })
          if (list) {
            this.shoppingListService.updateShoppingList(list)
          }
        }
      });
  }

  addFromCalendar(dates: string[]) {
    const datesToString = dates.join('&');
    this.router.navigate(['tabs', 'shopping-list', 'dates', datesToString]);
  }

  @ViewChild(IonModal) modal: IonModal | undefined;

  selectedDates: [] = [];
  selectedDateChanged(event: any) {
    this.selectedDates = event.detail.value;
  }

  cancel() {
    this.modal?.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal?.dismiss(this.selectedDates, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string[]>>;
    if (ev.detail.role === 'confirm' && ev.detail.data) {
      this.addFromCalendar(ev.detail.data)
    }
  }

  @ViewChild(RecordExpensesComponent) expensesModal: RecordExpensesComponent | undefined;

  async recordPrice(item: ShoppingListItem) {
    const modal = await this.modalCtrl.create({
      component: RecordExpensesComponent,
      componentProps: {
        title: item.title,
        isModal: true
      },
      initialBreakpoint: 0.75
    });
    modal.present();
  }

  async onChangeList(item: ShoppingListItem, previousListName: string) {
    let cloned = _.cloneDeep(this.activeList);
    const listNames = cloned?.map(list => list.name);
    const modal = await this.modalCtrl.create({
      component: ControllerListSelectDialogComponent,
      componentProps: {
        list: listNames,
        selected: previousListName
      },
      initialBreakpoint: 0.75,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    const newListName = data;
    if (role === 'confirm') {
      let updatedList = cloned?.map(listItem => {
        if (listItem.name === previousListName) {
          const updated = {
            ...listItem,
            items: listItem.items.filter(el => el.title !== item.title)
          }
          return updated;
        } else if (listItem.name === newListName && !!listItem.items?.length) {
          const updated = {
            ...listItem,
            items: listItem.items.concat(item)
          }
          return updated;
        } else if (listItem.name === newListName && !listItem.items?.length) {
          const updated = {
            ...listItem,
            items: [item]
          }
          return updated;
        } else {
          return listItem;
        }
      })

      if (updatedList) {
        this.shoppingListService.updateShoppingList(updatedList)
      }
    } else {
      this.closeSlidingItem()
    }
  }

  async onEditAmount(item: ShoppingListItem, listName: string) {
    const modal = await this.modalCtrl.create({
      component: ControllerInputDialogComponent,
      componentProps: {
        inputFieldLabel: 'Редагувати кількість ' + item.title,
        fillValue: item.amount
      },
      initialBreakpoint: 0.5
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      let cloned = _.cloneDeep(this.activeList);
      const list = cloned?.map(listItem => {
        if (listItem.name === listName) {
          const updated = {
            ...listItem,
            items: listItem.items.map(el => {
              if (el.title === item.title) {
                return {
                  ...el,
                  amount: data
                }
              } else {
                return el;
              }
            })
          }
          return updated;
        } else {
          return listItem;
        }

      })
      if (list) {
        this.shoppingListService.updateShoppingList(list)
      }
    } else {
      this.closeSlidingItem()
    }
  }

  closeSlidingItem() {
    document.querySelectorAll('.slidingContainer').forEach((item: any) => item.close())
  }

  getHighestPrice(title: string) {
    return this.expensesService.getHighestPriceInfo(title)
  }

  getLowestPrice(title: string) {
    return this.expensesService.getLowestPriceInfo(title);
  }
}
