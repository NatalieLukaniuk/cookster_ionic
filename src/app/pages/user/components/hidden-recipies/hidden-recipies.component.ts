import { Component, computed, inject } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { RecipiesService } from 'src/app/services/recipies.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-hidden-recipies',
  templateUrl: './hidden-recipies.component.html',
  styleUrls: ['./hidden-recipies.component.scss'],
})
export class HiddenRecipiesComponent {
  recipiesService = inject(RecipiesService);
  userDataService = inject(UserDataService);


  // $allRecipies = this.recipiesService.getRecipies;
  $userPreferences = this.userDataService.userPreferences


  $noShowIds = computed(() => this.$userPreferences()?.noShowRecipies);

  numberOfRecipiesToDisplay = 10;

  $hiddenRecipies = this.recipiesService.hiddenRecipies;


  onIonInfinite(event: any) {
    this.numberOfRecipiesToDisplay += 10;
    (event as InfiniteScrollCustomEvent).target.complete();
  }


}
