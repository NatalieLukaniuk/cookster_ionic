import { Component, OnInit, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ShoppingListService, ShoppingListTimestamp } from 'src/app/services/shopping-list.service';
import { Router } from '@angular/router';
import { DialogsService } from 'src/app/services/dialogs.service';
import { ControllerInputDialogComponent } from 'src/app/shared/components/dialogs/controller-input-dialog/controller-input-dialog.component';
import { ControllerListSelectDialogComponent } from 'src/app/shared/components/dialogs/controller-list-select-dialog/controller-list-select-dialog.component';
import { AddToListModalComponent } from './components/add-to-list-modal/add-to-list-modal.component';
import { ShoppingList, ShoppingListItem } from 'src/app/models/shopping-list.models';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.page.html',
  styleUrls: ['./shopping-list.page.scss'],
})
export class ShoppingListPage implements OnInit {
  userDataService = inject(UserDataService);
  
  $timestamps = this.shoppingListService.shoppingListTimestamps;

  $userShoppingLists = this.userDataService.userShoppingLists;

  tabs = [
    { name: 'купити', icon: 'calendar-outline' },
    { name: 'куплені', icon: 'cart-outline' },
  ];
  currentTab = this.tabs[0].name;

  constructor(
    private shoppingListService: ShoppingListService,
    private modalCtrl: ModalController,
    private router: Router,
    private dialog: DialogsService
  ) { }

  ngOnInit() {
    this.shoppingListService.loadTimestamps();
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
    let cloned = this.$userShoppingLists();
    let updatedList: ShoppingList[] = cloned.map((ls: ShoppingList) => {
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
    let cloned = this.$userShoppingLists();
    const modal = await this.modalCtrl.create({
      component: AddToListModalComponent,
      componentProps: {
        ingredient: {},
        lists: this.shoppingListService.sortListByTimestamps(cloned!, this.$timestamps()),
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
          const list = this.$userShoppingLists().map(listItem => {
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

  async onChangeList(item: ShoppingListItem, previousListName: string) {
    let cloned = this.$userShoppingLists();
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
      let cloned = this.$userShoppingLists();
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
}
