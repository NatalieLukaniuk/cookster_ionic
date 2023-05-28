import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { Day, RecipyForCalendar } from 'src/app/models/calendar.models';
import { Ingredient } from 'src/app/models/recipies.models';
import { AddToListModalComponent } from 'src/app/pages/planner/components/add-to-list-modal/add-to-list-modal.component';
import { areObjectsEqual } from 'src/app/services/comparison';
import { DataMappingService } from 'src/app/services/data-mapping.service';
import { IAppState } from 'src/app/store/reducers';
import { take } from 'rxjs';
import { PlannerByDate, ShoppingList } from 'src/app/models/planner.models';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { PlannerService } from 'src/app/services/planner.service';
import { SLItem } from 'src/app/models/planner.models';
import * as _ from 'lodash';

@Component({
  selector: 'app-products-per-day',
  templateUrl: './products-per-day.component.html',
  styleUrls: ['./products-per-day.component.scss'],
})
export class ProductsPerDayComponent implements OnChanges {
  @Input() day!: Day;

  products: Ingredient[] = [];

  plannerWithActiveList: PlannerByDate | undefined;

  activeList: ShoppingList[] | undefined;
  constructor(
    private datamapping: DataMappingService,
    private modalCtrl: ModalController,
    private store: Store<IAppState>,
    private plannerService: PlannerService,
  ) {

    this.store.pipe(
      select(getCurrentUser),
      take(1),
    ).subscribe((user) => {
      if (user) {
        this.plannerWithActiveList = user.planner?.find(
          (planner) => planner.isShoppingListActive
        );
        if(this.plannerWithActiveList && this.plannerWithActiveList.shoppingLists){
          this.activeList = this.plannerWithActiveList.shoppingLists;
        } 
      };
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.products = [];
    if (
      changes['day'].currentValue &&
      (!changes['day'].previousValue ||
        !areObjectsEqual(
          changes['day'].currentValue,
          changes['day'].previousValue
        ))
    )
      this.day.details.breakfastRecipies.forEach((recipy) =>
        this.processRecipy(recipy)
      );
    this.day.details.lunchRecipies.forEach((recipy) =>
      this.processRecipy(recipy)
    );
    this.day.details.dinnerRecipies.forEach((recipy) =>
      this.processRecipy(recipy)
    );
  }

  processRecipy(recipy: RecipyForCalendar) {
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

  getCoeficient(recipy: RecipyForCalendar) {
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
      name: ingred.ingredient? ingred.ingredient : '',
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
      this.plannerService.updateShoppingLists(data, this.plannerWithActiveList!);
    }
  }
}
