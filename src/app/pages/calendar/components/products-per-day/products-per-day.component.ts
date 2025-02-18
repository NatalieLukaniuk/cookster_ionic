import { Component, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { IonModal, ModalController } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { Ingredient } from 'src/app/models/recipies.models';
import { AddToListModalComponent } from 'src/app/pages/shopping-list/components/add-to-list-modal/add-to-list-modal.component';
import { DataMappingService } from 'src/app/services/data-mapping.service';
import { IAppState } from 'src/app/store/reducers';
import { Subject, takeUntil, Observable } from 'rxjs';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import * as _ from 'lodash';
import { ShoppingListService } from 'src/app/services/shopping-list.service';
import { RecipyForCalendar_Reworked } from '../../../../models/calendar.models';
import { ShoppingList, SLItem } from 'src/app/models/shopping-list.models';
import { CalendarReworkedService } from '../../calendar-reworked.service';

@Component({
  selector: 'app-products-per-day',
  templateUrl: './products-per-day.component.html',
  styleUrls: ['./products-per-day.component.scss'],
})
export class ProductsPerDayComponent implements OnDestroy {

  recipies$: Observable<RecipyForCalendar_Reworked[]> = this.calendarService.getCurrentDayRecipies();

  products: Ingredient[] = [];

  activeList: ShoppingList[] | undefined;

  destroy$ = new Subject<void>();
  constructor(
    private datamapping: DataMappingService,
    private modalCtrl: ModalController,
    private store: Store<IAppState>,
    private shoppingListService: ShoppingListService,
    private calendarService: CalendarReworkedService
  ) {

    this.store.pipe(
      select(getCurrentUser),
      takeUntil(this.destroy$),
    ).subscribe((user) => {
      if (user) {
        this.activeList = user.shoppingLists;
      };
    });
    this.recipies$.pipe(takeUntil(this.destroy$)).subscribe(recipies => {

      this.products = [];
      recipies.forEach(recipy => this.processRecipy(recipy))
      this.products.sort((a, b) => a.ingredient!.localeCompare(b.ingredient!));
    })
  }
  ngOnDestroy(): void {
    this.destroy$.next()
  }

  processRecipy(recipy: RecipyForCalendar_Reworked) {
    recipy.ingrediends.forEach((recipyIngred) => {
      const found = this.products.find(
        (ingred) => recipyIngred.product === ingred.product
      );
      if (found) {
        found.amount += recipyIngred.amount * this.getCoeficient(recipy);
      } else {
        this.products.push({
          product: recipyIngred.product,
          amount: recipyIngred.amount * this.getCoeficient(recipy),
          defaultUnit: recipyIngred.defaultUnit,
          ingredient: this.getIngredientText(recipyIngred),
        });
      }
    });
  }

  getCoeficient(recipy: RecipyForCalendar_Reworked) {
    if (recipy) {
      return this.datamapping.getCoeficient(
        recipy.ingrediends,
        recipy.portions,
        recipy.amountPerPortion
      );
    } else return 0;
  }

  getIngredientText(ingredient: Ingredient): string {
    return this.datamapping.getIngredientText(ingredient);
  }

  async addToList(ingred: Ingredient) {
    let cloned = _.cloneDeep(this.activeList);
    const ingredToSlItem: SLItem = {
      total: ingred.amount,
      name: ingred.ingredient ? ingred.ingredient : '',
      id: ingred.product,
      unit: ingred.defaultUnit,
      items: []
    }
    const modal = await this.modalCtrl.create({
      component: AddToListModalComponent,
      componentProps: {
        ingredient: ingredToSlItem,
        lists: cloned,
        isPlannedIngredient: true,
      },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.shoppingListService.updateShoppingList(data);
    }
  }


  @ViewChild(IonModal) modal!: IonModal;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }
}
