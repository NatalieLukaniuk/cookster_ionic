import { Component, computed, inject, input, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DishType, Ingredient, MeasuringUnit, MeasuringUnitText, productPreferencesChip, Recipy } from 'src/app/models/recipies.models';
import { UserDataService } from 'src/app/services/user-data.service';
import { SharedModule } from "../../shared.module";
import { AddRecipyToCalendarModalComponent } from 'src/app/pages/calendar/components/add-recipy-to-calendar-modal/add-recipy-to-calendar-modal.component';
import { IonicModule, ModalController } from '@ionic/angular';
import { DataMappingService } from 'src/app/services/data-mapping.service';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss'],
  imports: [SharedModule, IonicModule],
})
export class RecipeCardComponent {
  recipy = input.required<Recipy>();
  productPreferencesChips = input<productPreferencesChip[] | null>([]);

  userDataService = inject(UserDataService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  datamapping = inject(DataMappingService)

  isShowProductsWarning = computed(() => {
    return this.productPreferencesChips()?.find(product => this.recipy().ingrediends.some(ingred => ingred.product === product.productId))
  })

  productPreferencesToShow = computed(() => this.productPreferencesChips()?.filter(chip => !!this.recipy().ingrediends.find(ingred => ingred.product === chip.productId)))

  constructor(private modalCtrl: ModalController,) {

  }

  $isUserLoggedIn = this.userDataService.isUserLoggedIn;

  clickState = 0;

  cycleStates() {
    this.clickState = (this.clickState + 1) % 3;
  }

  resetCard(event: Event) {
    event.stopPropagation(); // Stop click from cycling state forward
    this.clickState = 0;
  }

  $userCollections = this.userDataService.userRecipeCollections;
  $includedInCollections = computed(() => this.$userCollections().filter((collection) => collection.recipies?.includes(this.recipy().id)).map((coll) => coll.name))
  $recipyCollections = computed(() => this.$userCollections().map((collection) => collection.name))
  isNeedsAdvancePreparation = computed(() => this.recipy().type?.includes(
    DishType['потребує попередньої підготовки']
  ))

  activePreparationTime = computed(() => {
    let time = 0;
    for (let step of this.recipy().steps) {
      time = time + +step.timeActive;
    }
    return time;
  })

  passivePreparationTime = computed(() => {
    let time = 0;
    for (let step of this.recipy().steps) {
      time = time + +step.timePassive;
    }
    return time;
  })

  totalPreparatinTime = computed(() => this.passivePreparationTime() + this.activePreparationTime())


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

  goFullRecipy() {
    this.router.navigate(['recipy/', this.recipy().id], {
      relativeTo: this.route,
    });
  }

  async onAddRecipyToCalendar() {

    const modal = await this.modalCtrl.create({
      component: AddRecipyToCalendarModalComponent,
      componentProps: {
        selectedRecipy: signal(this.recipy()),
        isEditMode: true,
        portionSize: signal(this.recipy().portionSize)
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.userDataService.addRecipyToCalendar(data)
    }
  }

  getIngredientText(ingredient: Ingredient): string {
    return this.datamapping.getIngredientText(ingredient);
  }

  getUnitText(unit: MeasuringUnit) {
    return MeasuringUnitText[unit];
  }

    getProductText(id: string) {
    return this.datamapping.getProductNameById(id)
  }



}
