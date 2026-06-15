import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { combineLatest, map, Subject, takeUntil, tap } from 'rxjs';
import { FiltersService } from 'src/app/filters/services/filters.service';
import { User } from 'src/app/models/auth.models';
import { Recipy } from 'src/app/models/recipies.models';
import { RecipiesService } from 'src/app/services/recipies.service';
import { IAppState } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

@Component({
  selector: 'app-hidden-recipies',
  templateUrl: './hidden-recipies.component.html',
  styleUrls: ['./hidden-recipies.component.scss'],
})
export class HiddenRecipiesComponent {
  recipiesService = inject(RecipiesService);

  currentUser: User | null | undefined;

  user$ = this.store.pipe(select(getCurrentUser), tap(user => this.currentUser = user));

  // $allRecipies = this.recipiesService.getRecipies;

  noShowIds: string[] = []; // TODO this needs to be taken from userdata service

  numberOfRecipiesToDisplay = 10;

  $hiddenRecipies = this.recipiesService.hiddenRecipies;

  constructor(
    private store: Store<IAppState>,
  ) { }

  onIonInfinite(event: any) {
    this.numberOfRecipiesToDisplay += 10;
    (event as InfiniteScrollCustomEvent).target.complete();
  }


}
