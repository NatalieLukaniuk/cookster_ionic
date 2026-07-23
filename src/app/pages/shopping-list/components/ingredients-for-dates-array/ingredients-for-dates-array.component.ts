import { Component, effect, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular';

import * as moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { Ingredient } from 'src/app/models/recipies.models';
import { NormalizeDisplayedAmountGetNumber, convertAmountToSelectedUnit, getRecipyNameById, getUnitText, isDrinkOrSoup, transformToGr } from 'src/app/pages/recipies/utils/recipy.utils';

import { DataMappingService } from 'src/app/services/data-mapping.service';
import { DialogsService } from 'src/app/services/dialogs.service';
import { ShoppingListService } from 'src/app/services/shopping-list.service';
import { AddToListModalComponent } from '../add-to-list-modal/add-to-list-modal.component';
import { CalendarRecipyInDatabase_Reworked, RecipyForCalendar_Reworked } from 'src/app/models/calendar.models';
import { iSameDay } from 'src/app/pages/calendar/calendar.utils';
import { ShoppingListItem, SLItem, ShoppingList } from 'src/app/models/shopping-list.models';
import { ProductsService } from 'src/app/services/products.service';
import { RecipiesService } from 'src/app/services/recipies.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-ingredients-for-dates-array',
  templateUrl: './ingredients-for-dates-array.component.html',
  styleUrls: ['./ingredients-for-dates-array.component.scss']
})
export class IngredientsForDatesArrayComponent implements OnDestroy, OnInit {
  productsService = inject(ProductsService);
  recipiesService = inject(RecipiesService);
  userDataService = inject(UserDataService);

  datesArray: string[];

  $allRecipies = this.recipiesService.getRecipies;


  fullIngredsList$ = new Subject<ShoppingListItem[]>();

  $userPlannedRecipies = this.userDataService.userPlannedRecipies;
  $shoppingList = this.userDataService.userShoppingLists;

  itemsTree: SLItem[] | undefined;

  myLists: ShoppingList[] = [];


  destroyed$ = new Subject<void>();

  getUnitText = getUnitText;

  scrollPoint = 0;

  resetScrollPoint = true;

  @ViewChild(IonContent) content: IonContent | undefined;

  constructor(
    private dataMapping: DataMappingService,
    private dialog: DialogsService,
    private shoppingListService: ShoppingListService,
    private modalCtrl: ModalController
  ) {
    const path = window.location.pathname.split('/');
    const datesString = path[path.length - 1];
    this.datesArray = datesString.split('&');

    effect(() => {
      //TODO needs revision and rework
      const plannedRecipies = this.$userPlannedRecipies();
      const shoppingList = this.$shoppingList();
      if (plannedRecipies) {
        const dayItemsToAdd = plannedRecipies.filter(
          (detail: CalendarRecipyInDatabase_Reworked) =>
            !!this.datesArray.find(date => iSameDay(new Date(detail.endTime), new Date(date)))
        );
        let list: any[] = [];
        dayItemsToAdd.forEach((plannedRecipy: CalendarRecipyInDatabase_Reworked) => {
          const foundRecipy = this.$allRecipies().find(recipy => recipy.id === plannedRecipy.recipyId);
          if (foundRecipy) {
            const coeficient = this.dataMapping.getCoeficient(
              foundRecipy.ingrediends,
              plannedRecipy.portions,
              plannedRecipy.amountPerPortion,
              isDrinkOrSoup(foundRecipy)
            );
            foundRecipy.ingrediends.forEach((ingr: Ingredient) => {
              let itemToPush = {
                product: ingr.product,
                amount: (ingr.amount * coeficient).toString(),
                defaultUnit: ingr.defaultUnit,
                recipyId: [foundRecipy.id],
                date: plannedRecipy.endTime
              };
              list.push(itemToPush);
            });
          }

        });
        this.fullIngredsList$.next(list);
      }

      if (shoppingList) {
        this.myLists = shoppingList;
        this.myLists = this.myLists.map((list) => {
          if (!list.items) {
            return {
              ...list,
              items: [],
            };
          } else return list;
        });
      }
    }, { allowSignalWrites: true })
  }

  setScroll() {
    if (this.content) {
      this.content.scrollToPoint(null, this.scrollPoint, 0);
      this.resetScrollPoint = true;
    }

  }

  ngOnInit(): void {
    this.fullIngredsList$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
      if (res) {
        this.itemsTree = [];
        this.buildTree(res);
        console.log(this.itemsTree);
      }
    });
  }

  getCoef(recipy: RecipyForCalendar_Reworked): number {
    let totalAmount = 0;
    const isLiquid = isDrinkOrSoup(recipy)
    recipy.ingrediends.forEach((ingr) => {
      if (this.dataMapping.getIsIngredientIncludedInAmountCalculation(ingr, isLiquid)) {
        totalAmount = totalAmount + +ingr.amount;
      }
    });
    return (recipy.portions * recipy.amountPerPortion) / totalAmount;
  }

  ngOnDestroy(): void {
    this.destroyed$.next()
  }

  buildTree(allitems: any) {
    this.itemsTree = [];
    allitems.forEach((item: any) => {
      if (
        this.itemsTree!.length &&
        this.itemsTree!.find((it) => it.id == item.product)
      ) {
        this.itemsTree = this.itemsTree!.map((it) => {
          if (it.id == item.product) {
            const convertedToselectedUnit = convertAmountToSelectedUnit(item.amount, item.defaultUnit, item.product, this.productsService.getProducts());
            const normalized = NormalizeDisplayedAmountGetNumber(convertedToselectedUnit, item.defaultUnit)
            const correctAmmount = transformToGr(item.product, normalized, item.defaultUnit, this.productsService.getProducts())
            let updated = { ...it };
            updated.total = +it.total + correctAmmount;
            updated.items.push(item);
            return updated;
          } else return it;
        });
      } else if (this.itemsTree) {
        const convertedToselectedUnit = convertAmountToSelectedUnit(item.amount, item.defaultUnit, item.product, this.productsService.getProducts());
        const normalized = NormalizeDisplayedAmountGetNumber(convertedToselectedUnit, item.defaultUnit)
        const correctAmmount = transformToGr(item.product, normalized, item.defaultUnit, this.productsService.getProducts())
        this.itemsTree.push({
          id: item.product,
          total: correctAmmount,
          unit: item.defaultUnit,
          name: this.dataMapping.getProductNameById(item.product),
          items: [item],
        });
      }
    });
    this.itemsTree = this.itemsTree.map(item => ({ ...item, unit: this.dataMapping.getDefaultMU(item.id) }))
    this.itemsTree.sort((a, b) => a.name.localeCompare(b.name));
  }

  getHasBeenAddedToList(item: SLItem): string | undefined {
    return this.myLists.find(
      (list) => !!list.items.find((ingr) => ingr.title == item.name)
    )?.name;
  }

  removeFromList(ingred: SLItem, listName: string) {
    this.dialog
      .openConfirmationDialog(
        `Видалити ${ingred.name} зі списку ${listName}?`,
        'Ця дія незворотня'
      )
      .then((res) => {
        if (res.role === 'confirm') {
          this.resetScrollPoint = false;
          this.myLists = this.myLists.map((list) => {
            if (list.name === listName) {
              list.items = list.items.filter(
                (ingr) => ingr.title !== ingred.name
              );
            }
            return list;
          });
          this.shoppingListService.updateShoppingList(this.myLists);
        }
      });
  }

  getAmountInList(item: SLItem): string | undefined {
    let ls = this.myLists.find((list) =>
      list.items.find((ingr) => ingr.title == item.name)
    );
    if (ls) {
      return ls.items.find((ingr) => ingr.title == item.name)?.amount;
    } else return undefined;
  }

  recordScroll(event: any) {
    if (this.resetScrollPoint) {
      this.scrollPoint = event.detail.scrollTop
    }
  }



  async addToList(ingred: SLItem) {
    this.resetScrollPoint = false;
    const timestamps = this.shoppingListService.shoppingListTimestamps()
    const modal = await this.modalCtrl.create({
      component: AddToListModalComponent,
      componentProps: {
        ingredient: ingred,
        lists: this.shoppingListService.sortListByTimestamps(this.myLists, timestamps),
        allRecipies: this.$allRecipies(),
        isPlannedIngredient: true,
      },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.shoppingListService.updateShoppingList(data);
    }
  }

  getrecipyName(id: string) {
    return getRecipyNameById(this.$allRecipies(), id);
  }

  getDatesForHeader() {
    const formattedDatesArray = this.datesArray.map(date => moment(date, 'YYYYMMDD').format('DD MMM'))
    return formattedDatesArray.join(', ')
  }

}
