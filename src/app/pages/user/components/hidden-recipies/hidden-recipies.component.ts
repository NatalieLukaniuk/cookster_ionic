import { Component, OnDestroy, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { combineLatest, map, Subject, takeUntil, tap } from 'rxjs';
import { FiltersService } from 'src/app/filters/services/filters.service';
import { User } from 'src/app/models/auth.models';
import { Recipy } from 'src/app/models/recipies.models';
import { IAppState } from 'src/app/store/reducers';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

@Component({
  selector: 'app-hidden-recipies',
  templateUrl: './hidden-recipies.component.html',
  styleUrls: ['./hidden-recipies.component.scss'],
})
export class HiddenRecipiesComponent implements OnInit, OnDestroy {
  currentUser: User | null | undefined;

  user$ = this.store.pipe(select(getCurrentUser), tap(user => this.currentUser = user));
  destroy$ = new Subject<void>();

  allRecipies$ = this.store.pipe(select(getAllRecipies));

  recipies: Recipy[] = [];
  noShowIds: string[] = [];

  numberOfRecipiesToDisplay = 10;

  recipies$ = combineLatest([
    this.store.pipe(select(getAllRecipies)),
    this.filtersService.noShowRecipies$,
  ]).pipe(
    takeUntil(this.destroy$),
    map(result => {
      const [allRecipies, noShowIds] = result;
      if (noShowIds) {
        this.noShowIds = noShowIds;
      }

      const filtered = allRecipies.filter(recipy => noShowIds?.includes(recipy.id));
      this.recipies = filtered
      return filtered
    })
  )

  constructor(
    private store: Store<IAppState>,
    private filtersService: FiltersService,
  ) { }

  ngOnInit() { }
  ngOnDestroy(): void {
    this.destroy$.next()
  }

  onIonInfinite(event: any) {
    this.numberOfRecipiesToDisplay += 10;
    (event as InfiniteScrollCustomEvent).target.complete();
  }


}
