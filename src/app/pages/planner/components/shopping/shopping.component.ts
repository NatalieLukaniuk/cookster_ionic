import { AddToListModalComponent } from './../add-to-list-modal/add-to-list-modal.component';
import { DataMappingService } from './../../../../services/data-mapping.service';
import {
  PlannerByDate,
  ShoppingList,
  ShoppingListItem,
  SLItem,
} from './../../../../models/planner.models';
import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Subject, Observable, takeUntil, combineLatest, map } from 'rxjs';
import { Day, RecipyForCalendar } from 'src/app/models/calendar.models';
import { Recipy, Ingredient } from 'src/app/models/recipies.models';
import { PlannerService } from 'src/app/services/planner.service';
import { IAppState } from 'src/app/store/reducers';
import { getCalendar } from 'src/app/store/selectors/calendar.selectors';
import { getCurrentPlanner } from 'src/app/store/selectors/planners.selectors';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import {
  getRecipyNameById,
  getUnitText,
} from 'src/app/pages/recipies/utils/recipy.utils';
import { ModalController } from '@ionic/angular';
import { DialogsService } from 'src/app/services/dialogs.service';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.scss'],
})
export class ShoppingComponent implements OnInit {
  @Input() currentPlanner!: PlannerByDate;

  get isShoppingListActive(): boolean {
    return !!this.currentPlanner?.isShoppingListActive;
  }
  destroyed$ = new Subject<void>();

  currentUser$ = this.store.pipe(select(getCurrentUser));

  planner$: Observable<PlannerByDate | null> = this.store.pipe(
    select(getCurrentPlanner)
  );
  calendar$: Observable<Day[] | null> = this.store.pipe(select(getCalendar));

  fullIngredsList$ = new Subject<ShoppingListItem[]>();

  allRecipies: Recipy[] = [];

  itemsTree: SLItem[] | undefined;

  myLists: ShoppingList[] = [];

  getUnitText = getUnitText;

  constructor(
    private store: Store<IAppState>,
    private dataMapping: DataMappingService,
    private plannerService: PlannerService,
    private modalCtrl: ModalController,
    private dialog: DialogsService
  ) {
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
    combineLatest([this.planner$, this.calendar$])
      .pipe(
        takeUntil(this.destroyed$),
        map((res) => ({ planner: res[0], calendar: res[1] }))
      )
      .subscribe((res) => {
        if (res.planner && res.planner.shoppingLists) {
          this.myLists = _.cloneDeep(res.planner.shoppingLists);
          this.myLists = this.myLists.map((list) => {
            if (!list.items) {
              return {
                ...list,
                items: [],
              };
            } else return list;
          });
        }
        if (res.planner && res.calendar) {
          let fullCal = res.calendar;
          const dayItemsToAdd = fullCal.filter(
            (detail: Day) =>
              moment(detail.details.day, 'DDMMYYYY').isSameOrAfter(
                moment(this.currentPlanner.startDate, 'DDMMYYYY')
              ) &&
              moment(detail.details.day, 'DDMMYYYY').isSameOrBefore(
                moment(this.currentPlanner.endDate, 'DDMMYYYY')
              )
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
      });
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
            let updated = { ...it };
            updated.total = +it.total + +item.amount;
            updated.items.push(item);
            return updated;
          } else return it;
        });
      } else if (this.itemsTree) {
        this.itemsTree.push({
          id: item.product,
          total: +item.amount,
          unit: this.dataMapping.getDefaultMU(item.product),
          name: this.dataMapping.getProductNameById(item.product),
          items: [item],
        });
      }
    });
    this.itemsTree.sort((a, b) => a.name.localeCompare(b.name));
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

  getrecipyName(id: string) {
    if (this.allRecipies) {
      return getRecipyNameById(this.allRecipies, id);
    } else return '';
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }
  getDisplayRange() {
    if (this.currentPlanner) {
      return {
        startDate: this.currentPlanner.startDate,
        endDate: this.currentPlanner.endDate,
      };
    } else return undefined;
  }

  getHasBeenAddedToList(item: SLItem): string | undefined {
    return this.myLists.find(
      (list) => !!list.items.find((ingr) => ingr.title == item.name)
    )?.name;
  }

  getAmountInList(item: SLItem): string | undefined {
    let ls = this.myLists.find((list) =>
      list.items.find((ingr) => ingr.title == item.name)
    );
    if (ls) {
      return ls.items.find((ingr) => ingr.title == item.name)?.amount;
    } else return undefined;
  }

  makeListActive() {
    if (this.currentPlanner) {
      this.plannerService.makeShoppingListActive(this.currentPlanner);
    }
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
      this.plannerService.updateShoppingLists(data, this.currentPlanner);
    }
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
          this.plannerService.updateShoppingLists(
            this.myLists,
            this.currentPlanner
          );
        }
      });
  }
}
