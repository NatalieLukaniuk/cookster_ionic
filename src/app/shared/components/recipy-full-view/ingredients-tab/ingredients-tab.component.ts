import {
  Component,
  inject,
  input,
  output,
  signal,
  effect,
  computed,
} from '@angular/core';
import { Recipy } from 'src/app/models/recipies.models';
import { DataMappingService } from 'src/app/services/data-mapping.service';
import { ItemOption } from '../../ingredient/ingredient.component';
import { AVERAGE_PORTION } from 'src/app/shared/constants';
import { isDrinkOrSoup } from 'src/app/pages/recipies/utils/recipy.utils';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-ingredients-tab',
  templateUrl: './ingredients-tab.component.html',
  styleUrls: ['./ingredients-tab.component.scss'],
})
export class IngredientsTabComponent {
  userDataService = inject(UserDataService);

  recipy = input.required<Recipy>();
  portions = input<number>(4);
  amountPerPortion = input<number>(200);
  ingredStartOptions = input<ItemOption[]>([]);

  portionsChanged = output<{
    portions: number;
    amountPerPortion: number;
  }>();

  $isEditPortions = signal(false);

  $isSplitToGroups = signal(false);
  $groups = computed(() => {
    if (this.$isSplitToGroups()) {
      return this.getGroups()
    } else return []
  });

  $userPreferences = this.userDataService.userPreferences;
  $userFamily = this.userDataService.userFamily;

  $portionsToServe = signal<number>(4);
  $portionSize = signal<number>(AVERAGE_PORTION);

  coeficient = computed(() => this.datamapping.getCoeficient(
    this.recipy().ingrediends,
    this.$portionsToServe(),
    this.$portionSize(),
    isDrinkOrSoup(this.recipy())
  ));


  constructor(private datamapping: DataMappingService) {
    effect(() => {
      if (!this.portions()) {
        const recipyRecommendedPortionSize = this.recipy().portionSize;
        const defaultPortionSizeSetByUser = this.$userPreferences()?.defaultPortionSize;
        const userPreferences = this.$userPreferences()
        const portionSizeToSet = !userPreferences ? AVERAGE_PORTION :
          userPreferences.isUseRecommendedPortionSize && recipyRecommendedPortionSize ? recipyRecommendedPortionSize :
            !userPreferences.isUsePersonalizedPortionSize && defaultPortionSizeSetByUser ? defaultPortionSizeSetByUser :
              recipyRecommendedPortionSize !== undefined ? recipyRecommendedPortionSize : AVERAGE_PORTION;
        this.$portionSize.set(portionSizeToSet)
      }
    }, {allowSignalWrites: true})
    effect(() => {
      if (!this.amountPerPortion()) {
        const userFamily = this.$userFamily();
        if (userFamily?.length) {
          this.$portionsToServe.set(userFamily.length)
        }
      }
    }, { allowSignalWrites: true })
    effect(() => {
      this.$portionsToServe.set(this.portions());
    }, { allowSignalWrites: true })

    effect(() => {
      this.$portionSize.set(this.amountPerPortion());
    }, { allowSignalWrites: true })

    effect(() => {
      this.$isSplitToGroups.set(this.recipy().isSplitIntoGroups);
    }, { allowSignalWrites: true })
  }


  getGroups(): string[] {
    const groups = this.recipy().ingrediends.map(ingr => ingr.group).filter(groupName => groupName !== undefined) as string[];
    const unique = new Set<string>(groups);
    return Array.from(unique)
  }


  onPortionsChanged() {
    this.portionsChanged.emit({
      portions: +this.$portionsToServe(),
      amountPerPortion: +this.$portionSize(),
    });

    this.$isEditPortions.set(false);
  }
}
