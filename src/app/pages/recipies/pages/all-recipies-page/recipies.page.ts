import { FiltersService } from './../../../../filters/services/filters.service';
import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { productPreferencesChip } from 'src/app/models/recipies.models';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { LayoutService } from 'src/app/services/layout.service';
import { RecipiesService } from 'src/app/services/recipies.service';
import { UserDataService } from 'src/app/services/user-data.service';

const RECIPY_CARD_HEIGHT = 750;

@Component({
  selector: 'app-recipies',
  templateUrl: 'recipies.page.html',
  styleUrls: ['recipies.page.scss'],
})
export class RecipiesContainerPage {
  filtersService = inject(FiltersService);
  recipiesService = inject(RecipiesService);
  userDataService = inject(UserDataService);
  layoutService = inject(LayoutService)

  $currentFilters = this.filtersService.getCurrentFilters
  $recipies = this.recipiesService.recipiesWithFilterEnabled;
  $recipiesToDisplay = computed(() => this.$recipies().filter((r, i) => i <= this.numberOfRecipiesToDisplay()))
  $isShowWidget = this.filtersService.isShowWidget;
  $userFamily = this.userDataService.userFamily;
  isBigScreen = this.layoutService.getIsBigScreen();
  threshhold = RECIPY_CARD_HEIGHT * 2;
  numberOfRecipiesToDisaplyAtOnce = this.isBigScreen ? 20 : 3;

  showGoTop = false;

  productChips = computed<productPreferencesChip[]>(() => {
    const familyMembers = this.$userFamily();
    if (familyMembers && familyMembers.length) {
      let likeChips = familyMembers.map(member => {
        if (member.like) {
          return member.like.map(item => ({ name: member.name, productId: item, color: 'success' }))
        } else return []
      }
      ).flat().filter(i => !!i.productId);

      let noLikeChips = familyMembers.map(member => {
        if (member.noLike) {
          return member.noLike.map(item => ({ name: member.name, productId: item, color: 'warning' }))
        } else return []
      }
      ).flat().filter(i => !!i.productId);

      let noEatChips = familyMembers.map(member => {
        if (member.noEat) {
          return member.noEat.map(item => ({ name: member.name, productId: item, color: 'danger' }))
        } else return []
      }
      ).flat().filter(i => !!i.productId);

      const concatenated = likeChips.concat(noLikeChips).concat(noEatChips);
      return concatenated
    } else return []
  })

  numberOfRecipiesToDisplay = signal(this.numberOfRecipiesToDisaplyAtOnce);



  onscroll(event: any) {
    this.showGoTop = event.detail.scrollTop > 500;
  }

  @ViewChild('scrollingContainer') scrollingContainer: any;

  goTop() {
    this.scrollingContainer.scrollToTop()
  }

  onIonInfinite(event: any) {
    this.numberOfRecipiesToDisplay.update(current => current + this.numberOfRecipiesToDisaplyAtOnce);
    (event as InfiniteScrollCustomEvent).target.complete();
  }
}
