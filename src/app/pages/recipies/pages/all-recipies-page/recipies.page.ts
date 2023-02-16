import { FiltersService } from './../../../../filters/services/filters.service';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/reducers';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { getFilters } from 'src/app/store/selectors/filters.selectors';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-recipies',
  templateUrl: 'recipies.page.html',
  styleUrls: ['recipies.page.scss'],
})
export class RecipiesContainer {
  filters$ = this.store.pipe(select(getFilters));
  recipies$ = combineLatest([
    this.store.pipe(select(getAllRecipies)),
    this.filters$,
  ]).pipe(map((res) => this.filtersService.applyFilters(res[0], res[1])));

  user$ = this.store.pipe(select(getCurrentUser));

  constructor(
    private store: Store<IAppState>,
    private filtersService: FiltersService
  ) {}
}
