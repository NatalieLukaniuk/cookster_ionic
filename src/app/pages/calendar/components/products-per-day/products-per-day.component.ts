import { Component, effect, inject, OnInit, ViewChild } from '@angular/core';
import { IonModal, ModalController } from '@ionic/angular';

import { Ingredient } from 'src/app/models/recipies.models';
import { AddToListModalComponent } from 'src/app/pages/shopping-list/components/add-to-list-modal/add-to-list-modal.component';
import { DataMappingService } from 'src/app/services/data-mapping.service';

import * as _ from 'lodash';
import { ShoppingListService } from 'src/app/services/shopping-list.service';
import { RecipyForCalendar_Reworked } from '../../../../models/calendar.models';
import { SLItem } from 'src/app/models/shopping-list.models';
import { CalendarReworkedService } from '../../calendar-reworked.service';
import { isDrinkOrSoup } from 'src/app/pages/recipies/utils/recipy.utils';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-products-per-day',
  templateUrl: './products-per-day.component.html',
  styleUrls: ['./products-per-day.component.scss'],
})
export class ProductsPerDayComponent implements OnInit {
  userDataService = inject(UserDataService);

  $recipies = this.calendarService.getCurrentDayRecipies;

  products: Ingredient[] = [];

  $activeList = this.userDataService.userShoppingLists;

  constructor(
    private datamapping: DataMappingService,
    private modalCtrl: ModalController,
    private shoppingListService: ShoppingListService,
    private calendarService: CalendarReworkedService
  ) {
    effect(() => {
      this.products = [];
      this.$recipies().forEach(recipy => this.processRecipy(recipy))
      this.products.sort((a, b) => a.ingredient!.localeCompare(b.ingredient!));
    }, { allowSignalWrites: true })
  }

  ngOnInit(): void {
    this.shoppingListService.loadTimestamps()
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
        recipy.amountPerPortion,
        isDrinkOrSoup(recipy)
      );
    } else return 0;
  }

  getIngredientText(ingredient: Ingredient): string {
    return this.datamapping.getIngredientText(ingredient);
  }

  async addToList(ingred: Ingredient) {
    let cloned = _.cloneDeep(this.$activeList());
    const ingredToSlItem: SLItem = {
      total: ingred.amount,
      name: ingred.ingredient ? ingred.ingredient : '',
      id: ingred.product,
      unit: ingred.defaultUnit,
      items: []
    }
    const timestamps = this.shoppingListService.shoppingListTimestamps();
    const modal = await this.modalCtrl.create({
      component: AddToListModalComponent,
      componentProps: {
        ingredient: ingredToSlItem,
        lists: this.shoppingListService.sortListByTimestamps(cloned!, timestamps),
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
