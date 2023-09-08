import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable, Subject, combineLatest, map, takeUntil } from 'rxjs';
import { Day, DayDetails, RecipyForCalendar } from 'src/app/models/calendar.models';
import { SLItem, ShoppingList, ShoppingListItem } from 'src/app/models/planner.models';
import { Ingredient, Recipy } from 'src/app/models/recipies.models';
import { AddToListModalComponent } from 'src/app/pages/planner/components/add-to-list-modal/add-to-list-modal.component';
import { NormalizeDisplayedAmountGetNumber, convertAmountToSelectedUnit, getRecipyNameById, getUnitText, transformToGr } from 'src/app/pages/recipies/utils/recipy.utils';
import { CalendarService } from 'src/app/services/calendar.service';
import { DataMappingService } from 'src/app/services/data-mapping.service';
import { DialogsService } from 'src/app/services/dialogs.service';
import { ShoppingListService } from 'src/app/services/shopping-list.service';
import { IAppState } from 'src/app/store/reducers';
import { getCalendar } from 'src/app/store/selectors/calendar.selectors';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { getUserPlannedRecipies, getUserShoppingList } from 'src/app/store/selectors/user.selectors';

@Component({
  selector: 'app-ingredients-for-dates-array',
  templateUrl: './ingredients-for-dates-array.component.html',
  styleUrls: ['./ingredients-for-dates-array.component.scss']
})
export class IngredientsForDatesArrayComponent implements OnDestroy, OnInit {

  datesArray: string[];

  allRecipies: Recipy[] = [];

  allRecipies$ = this.store
    .pipe(select(getAllRecipies))

  fullIngredsList$ = new Subject<ShoppingListItem[]>();
  calendar$: Observable<Day[] | null> = this.store.pipe(select(getCalendar));
  canedar$ = combineLatest([
    this.store.pipe(select(getUserPlannedRecipies)),
    this.allRecipies$
  ]).pipe(
    map((combinedResult: [DayDetails[] | undefined, Recipy[]]) => {
      if (combinedResult[0] && combinedResult[1]) {
        return this.calendarService.buildCalendarForDates(this.datesArray, combinedResult[0], combinedResult[1])
      } else return []
    }
    )
  )

  itemsTree: SLItem[] | undefined;

  myLists: ShoppingList[] = [];

  shoppingList$ = this.store.pipe(select(getUserShoppingList))

  destroyed$ = new Subject<void>();

  getUnitText = getUnitText;

  constructor(
    private dataMapping: DataMappingService,
    private store: Store<IAppState>,
    private dialog: DialogsService,
    private shoppingListService: ShoppingListService,
    private modalCtrl: ModalController,
    private calendarService: CalendarService
  ) {
    const path = window.location.pathname.split('/');
    const datesString = path[path.length - 1];
    this.datesArray = datesString.split('&');

    this.canedar$.subscribe();

    this.fullIngredsList$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
      if (res) {
        this.itemsTree = [];
        this.buildTree(res);
        console.log(this.itemsTree);
      }
    });

    this.store
      .pipe(select(getAllRecipies), takeUntil(this.destroyed$))
      .subscribe((res) => {
        if (res) {
          this.allRecipies = res;
        }
      });
  }
  ngOnInit(): void {
    combineLatest([this.calendar$, this.shoppingList$]).pipe(
      takeUntil(this.destroyed$),
      map(res => ({ calendar: res[0], shoppingList: res[1] }))).subscribe(res => {
        if (res.calendar) {
          const dayItemsToAdd = res.calendar.filter(
            (detail: Day) =>
              !!this.datesArray.find(date => moment(detail.details.day, 'DDMMYYYY').isSame(moment(date, 'YYYYMMDD')))
          );
          let list: any[] = [];
          dayItemsToAdd.forEach((day: Day) => {
            if (day.details.breakfastRecipies.length) {
              let newList = this.processMealtime('breakfast', day);
              list = list.concat(newList);
            }
            if (day.details.lunchRecipies.length) {
              let newList = this.processMealtime('lunch', day);
              list = list.concat(newList);
            }
            if (day.details.dinnerRecipies.length) {
              let newList = this.processMealtime('dinner', day);
              list = list.concat(newList);
            }
          });
          this.fullIngredsList$.next(list);
        }

        if (res.shoppingList) {
          this.myLists = _.cloneDeep(res.shoppingList);
          this.myLists = this.myLists.map((list) => {
            if (!list.items) {
              return {
                ...list,
                items: [],
              };
            } else return list;
          });
        }

      })
  }

  processMealtime(meal: string, day: Day) {
    let key: 'breakfastRecipies' | 'lunchRecipies' | 'dinnerRecipies' | null;
    let sublist: any[] = [];
    switch (meal) {
      case 'breakfast':
        key = 'breakfastRecipies';
        break;
      case 'lunch':
        key = 'lunchRecipies';
        break;
      case 'dinner':
        key = 'dinnerRecipies';
        break;
      default:
        key = null;
    }
    if (key) {
      day.details[key].forEach((recipy: RecipyForCalendar) => {
        const coef = this.getCoef(recipy);
        recipy.ingrediends.forEach((ingr: Ingredient) => {
          let itemToPush = {
            product: ingr.product,
            amount: (ingr.amount * coef).toString(),
            defaultUnit: ingr.defaultUnit,
            recipyId: [recipy.id],
            day: [{ day: day.details.day, meal: meal }],
          };
          sublist.push(itemToPush);
        });
      });
    }
    return sublist;
  }

  getCoef(recipy: RecipyForCalendar): number {
    let totalAmount = 0;
    recipy.ingrediends.forEach((ingr) => {
      if (this.dataMapping.getIsIngredientIncludedInAmountCalculation(ingr)) {
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
            const convertedToselectedUnit = convertAmountToSelectedUnit(item.amount, item.defaultUnit, item.product, this.dataMapping.products$.value);
            const normalized = NormalizeDisplayedAmountGetNumber(convertedToselectedUnit, item.defaultUnit)
            const correctAmmount = transformToGr(item.product, normalized, item.defaultUnit, this.dataMapping.products$.value)
            let updated = { ...it };
            updated.total = +it.total + correctAmmount;
            updated.items.push(item);
            return updated;
          } else return it;
        });
      } else if (this.itemsTree) {
        const convertedToselectedUnit = convertAmountToSelectedUnit(item.amount, item.defaultUnit, item.product, this.dataMapping.products$.value);
        const normalized = NormalizeDisplayedAmountGetNumber(convertedToselectedUnit, item.defaultUnit)
        const correctAmmount = transformToGr(item.product, normalized, item.defaultUnit, this.dataMapping.products$.value)
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

  async addToList(ingred: SLItem) {
    const modal = await this.modalCtrl.create({
      component: AddToListModalComponent,
      componentProps: {
        ingredient: ingred,
        lists: this.myLists,
        allRecipies: this.allRecipies,
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
    if (this.allRecipies) {
      return getRecipyNameById(this.allRecipies, id);
    } else return '';
  }

  getDatesForHeader() {
    const formattedDatesArray = this.datesArray.map(date => moment(date, 'YYYYMMDD').format('DD MMM'))
    return formattedDatesArray.join(', ')
  }

}
