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
import { AddToListModalComponent } from '../planner/components/add-to-list-modal/add-to-list-modal.component';
import { OverlayEventDetail } from '@ionic/core/components';
import { ShoppingListService } from 'src/app/services/shopping-list.service';
import { Router } from '@angular/router';
import { DialogsService } from 'src/app/services/dialogs.service';

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

  constructor(
    private store: Store<IAppState>,
    private shoppingListService: ShoppingListService,
    private modalCtrl: ModalController,
    private router: Router,
    private dialog: DialogsService
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
}
