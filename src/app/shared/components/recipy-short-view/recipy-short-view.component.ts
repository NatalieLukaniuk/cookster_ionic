import { ActivatedRoute, Router } from '@angular/router';

import { DataMappingService } from '../../../services/data-mapping.service';
import { Component, computed, inject, Input, OnInit } from '@angular/core';
import {
  ComplexityDescription,
  DishType,
  Ingredient,
  MeasuringUnit,
  MeasuringUnitText,
  Recipy,
  productPreferencesChip,
} from 'src/app/models/recipies.models';
import * as _ from 'lodash';
import { AddRecipyToCalendarModalComponent } from 'src/app/pages/calendar/components/add-recipy-to-calendar-modal/add-recipy-to-calendar-modal.component';
import { ModalController } from '@ionic/angular';
import { LayoutService } from 'src/app/services/layout.service';
import { isDrinkOrSoup } from 'src/app/pages/recipies/utils/recipy.utils';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-recipy-short-view',
  templateUrl: './recipy-short-view.component.html',
  styleUrls: ['./recipy-short-view.component.scss'],
})
export class RecipyShortViewComponent implements OnInit {
  userDataService = inject(UserDataService);

  $isUserLoggedIn = this.userDataService.isUserLoggedIn;

  @Input()
  recipy!: Recipy;

  @Input() productPreferencesChips: productPreferencesChip[] | null = [];
  @Input() isBigScreen = false;
  @Input() isShowActionButtons = true;

  isNeedsAdvancePreparation: boolean = false;

  isRecipyClicked: boolean = false;
  isShowCollections: boolean = false;

  $userCollections = this.userDataService.userRecipeCollections;
  $includedInCollections = computed(() => this.$userCollections().filter((collection) => collection.recipies?.includes(this.recipy.id)).map((coll) => coll.name))
  $recipyCollections = computed(() => this.$userCollections().map((collection) => collection.name))

  ingredientsToSkip = [
    '-Mu5TNCG6N8Q_nwkPmNb',
    '-Mu5UmO24kMVyKveKjah',
    '-MuzaMFzts_yzcBtPRyt',
    '-Muzb3OfJhqdsrleyz2a',
  ];

  Math = Math;
  DishType = DishType;

  coefficient = 1;

  MeasuringUnit = MeasuringUnit;

  get preparationTime() {
    let time = 0;
    for (let step of this.recipy.steps) {
      time = time + +step.timeActive + +step.timePassive;
    }
    return time;
  }

  get topIngredients() {
    let sorted = this.recipy.ingrediends
      .map((ingr) => ingr)
      .sort((a, b) => b.amount - a.amount);
    sorted = sorted.filter(
      (ingr) => !this.ingredientsToSkip.includes(ingr.product)
    );
    if (sorted.length >= 6) {
      sorted.splice(5);
    }
    return sorted;
  }

  getIngredientText(ingredient: Ingredient): string {
    return this.datamapping.getIngredientText(ingredient);
  }

  get complexity() {
    return ComplexityDescription[this.recipy.complexity];
  }



  get isMobile() {
    return this.layoutService.getIsMobile()
  }

  get isTablet() {
    return this.layoutService.getIsTablet()
  }

  get isDesktop() {
    return this.layoutService.getIsDesktop()
  }

  constructor(
    private datamapping: DataMappingService,
    private router: Router,
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    private layoutService: LayoutService,
  ) { }

  ngOnInit() {
    this.isNeedsAdvancePreparation = this.recipy.type?.includes(
      DishType['потребує попередньої підготовки']
    );
    this.getCoeficient()
  }

  onRecipyClicked() {
    if (this.isShowCollections && this.isRecipyClicked) {
      this.isShowCollections = true;
      this.isRecipyClicked = false;
    } else if (this.isShowCollections && !this.isRecipyClicked) {
      this.isShowCollections = false;
    } else {
      this.isRecipyClicked = !this.isRecipyClicked;
    }
  }

  goFullRecipy() {
    this.router.navigate(['recipy/', this.recipy.id], {
      relativeTo: this.route,
    });
    this.cancelClick()

  }

  cancelClick() {
    setTimeout(() => {
      this.isRecipyClicked = false;
    }, 2)
  }
  cancelClickNoTimeout() {
    this.isRecipyClicked = false;
  }

  activePreparationTime() {
    let time = 0;
    for (let step of this.recipy.steps) {
      time = time + +step.timeActive;
    }
    return time;
  }

  passivePreparationTime() {
    let time = 0;
    for (let step of this.recipy.steps) {
      time = time + +step.timePassive;
    }
    return time;
  }

  getProductText(id: string) {
    return this.datamapping.getProductNameById(id)
  }

  getIsInRecipy(productId: string) {
    return !!this.recipy.ingrediends.find(ingred => ingred.product === productId);
  }

  async onAddRecipyToCalendar() {

    const modal = await this.modalCtrl.create({
      component: AddRecipyToCalendarModalComponent,
      componentProps: {
        selectedRecipy: this.recipy,
        isEditMode: true,
        portionSize: this.recipy.portionSize
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.userDataService.addRecipyToCalendar(data)
    }
    this.isRecipyClicked = false;
  }

  getCoeficient() {
    if (this.recipy && this.recipy.portionSize) {
      this.coefficient = this.datamapping.getCoeficient(
        this.recipy.ingrediends,
        1,
        this.recipy.portionSize,
        isDrinkOrSoup(this.recipy)
      );
    }
  }

  getUnitText(unit: MeasuringUnit) {
    return MeasuringUnitText[unit];
  }

  isShowProductsWarning() {
    return this.productPreferencesChips?.find(product => this.recipy.ingrediends.some(ingred => ingred.product === product.productId))
  }

  ondragged(event: any) {
    if (!this.$isUserLoggedIn() && event.detail.amount > 20) {
      this.goFullRecipy()
    }
  }

  get isApprovedRecipy() {
    return !this.recipy.notApproved;
  }
}
