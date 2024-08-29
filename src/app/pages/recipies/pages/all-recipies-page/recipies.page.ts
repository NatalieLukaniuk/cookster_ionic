import { FiltersService } from './../../../../filters/services/filters.service';
import { getCurrentUser, getFamilyMembers } from 'src/app/store/selectors/user.selectors';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/reducers';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { Subject, combineLatest, map, takeUntil, tap } from 'rxjs';
import { Recipy, productPreferencesChip } from 'src/app/models/recipies.models';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import * as _ from 'lodash';
import { User } from 'src/app/models/auth.models';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-recipies',
  templateUrl: 'recipies.page.html',
  styleUrls: ['recipies.page.scss'],
})
export class RecipiesContainer implements OnDestroy {
  filters$ = this.filtersService.getFilters;
  recipies: Recipy[] = []

  showGoTop = false;

  user$ = this.store.pipe(select(getCurrentUser), tap(user => this.currentUser = user));
  productChips: productPreferencesChip[] = [];

  destroy$ = new Subject<void>();

  numberOfRecipiesToDisplay = 10;

  currentUser: User | null | undefined;

  isBigScreen = this.layoutService.getIsBigScreen();

  constructor(
    private store: Store<IAppState>,
    private filtersService: FiltersService,
    private layoutService: LayoutService
  ) {
    this.subscribeForProductChips();
    this.subscribeForRecipies()
  }
  ngOnDestroy(): void {
    this.destroy$.next()
  }

  subscribeForProductChips() {
    this.store.pipe(select(getFamilyMembers), takeUntil(this.destroy$), map(familyMembers => {
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
        this.productChips = concatenated
      }
    })).subscribe()
  }

  subscribeForRecipies() {
    combineLatest([
      this.store.pipe(select(getAllRecipies)),
      this.filters$,
      this.filtersService.noShowRecipies$
    ]).pipe(
      takeUntil(this.destroy$),
      map(res => _.cloneDeep(res)),
      map((res) => this.filtersService.applyFilters(res[0], res[1], res[2])),      
      tap(recipies => this.recipies = recipies)
    ).subscribe()
  }

  onscroll(event: any) {
    this.showGoTop = event.detail.scrollTop > 500;
  }

  @ViewChild('scrollingContainer') scrollingContainer: any;

  goTop() {
    this.scrollingContainer.scrollToTop()
  }

  onIonInfinite(event: any){
    this.numberOfRecipiesToDisplay += 10;
    (event as InfiniteScrollCustomEvent).target.complete();
  }
}
