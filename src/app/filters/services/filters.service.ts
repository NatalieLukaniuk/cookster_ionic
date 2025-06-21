import { Preferences, defaultPrefs } from './../../models/auth.models';
import { Filters, RecipySorting, RecipySortingDirection } from 'src/app/models/filters.models';
import { BehaviorSubject, map, shareReplay, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { Recipy, RecipyCollection } from 'src/app/models/recipies.models';
import { Store, select } from '@ngrx/store';
import { IAppState } from 'src/app/store/reducers';

import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import * as _ from 'lodash';
import { ExpenseItem } from 'src/app/expenses/expenses-models';
import { getUserCollections, getUserPlannedRecipies, getUserPreferences } from 'src/app/store/selectors/user.selectors';
import { CalendarRecipyInDatabase_Reworked } from 'src/app/models/calendar.models';
import { getLastPreparedDate } from 'src/app/pages/calendar/calendar.utils';
import * as moment from 'moment';
import { getActivePreparationTime, getPreparationTime } from 'src/app/pages/recipies/utils/recipy.utils';
import { getExpenses } from 'src/app/store/selectors/expenses.selectors';

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  filteredRecipies: number = 0;

  userCollections: RecipyCollection[] = [];
  userPlannedRecipies: CalendarRecipyInDatabase_Reworked[] = [];
  constructor(private store: Store<IAppState>) { }
  recipies$ = this.store.pipe(select(getAllRecipies));

  noShowRecipies$ = this.store.pipe(select(getUserPreferences), map(prefs => prefs ? prefs : defaultPrefs), map((preferences: Preferences) => preferences.noShowRecipies), shareReplay())

  clearedFilters: Filters = {
    ingredientsToExclude: [],
    ingredientsToInclude: [],
    maxPrepTime: 0,
    tagsToShow: [],
    tagsToExclude: [],
    collectionsToInclude: [],
    search: '',
    sorting: RecipySorting.Default,
    sortingDirection: RecipySortingDirection.SmallToBig
  };

  private currentFilters: Filters = _.cloneDeep(this.clearedFilters);

  private filters$: BehaviorSubject<Filters> = new BehaviorSubject(this.clearedFilters);

  userCollections$ = this.store.pipe(select(getUserCollections), tap(collections => {
    if (collections) {
      this.userCollections = collections
    }
  }))

  expenses: ExpenseItem[] | null = null;

  userExpenses$ = this.store.pipe(select(getExpenses), tap(userExpenses => {
    if (userExpenses) {
      this.expenses = userExpenses;
    }
  }))

  userPlannedRecipies$ = this.store.pipe(select(getUserPlannedRecipies), tap(plannedRecipies => {
    if (plannedRecipies) {
      this.userPlannedRecipies = plannedRecipies;
    }
  }))

  getFilters = this.filters$.asObservable().pipe(shareReplay(1));

  getCurrentFiltersValue(){
    return this.currentFilters;
  }

  applyFilters(recipies: Recipy[], filters: Filters, noShowIds?: string[]) {
    let _recipies = recipies.map((recipy) => recipy);

    _recipies = _recipies.filter((recipy) => !recipy.notApproved);
    if (noShowIds) {
      _recipies = _recipies.filter((recipy) => !noShowIds.includes(recipy.id))
    }

    if (filters.collectionsToInclude.length && this.userCollections.length) {
      let recipiesIdsToShow: string[] = [];
      filters.collectionsToInclude.forEach(collection => {
        const add = this.userCollections.find(item => item.name === collection)?.recipies;
        if (add?.length) {
          recipiesIdsToShow = recipiesIdsToShow.concat(add)
        }
      })
      _recipies = _recipies.filter(recipy => recipiesIdsToShow.includes(recipy.id))
    }

    if (!!filters.ingredientsToInclude.length) {
      _recipies = _recipies.filter((recipy) => {
        let recipyIngredientsIds = recipy.ingrediends.map(
          (ingr) => ingr.product
        );
        return filters.ingredientsToInclude.every((id) =>
          recipyIngredientsIds.includes(id)
        );
      });
    }
    if (!!filters.ingredientsToExclude.length) {
      _recipies = _recipies.filter((recipy) => {
        let recipyIngredientsIds = recipy.ingrediends.map(
          (ingr) => ingr.product
        );
        return !recipy.ingrediends.find((ingr) =>
          filters.ingredientsToExclude.includes(ingr.product)
        );
      });
    }
    if (!!filters.tagsToShow.length) {
      _recipies = _recipies.filter((recipy) => {
        return filters.tagsToShow.some((tag) => recipy.type.includes(tag));
      });
    }
    if (!!filters.tagsToExclude.length) {
      _recipies = _recipies.filter((recipy) => {
        return !filters.tagsToExclude.some((tag) => recipy.type.includes(tag));
      });
    }
    if (!!filters.maxPrepTime) {
      const maxTime = filters.maxPrepTime;
      _recipies = _recipies.filter((recipy) => {
        let prepTime = 0;
        recipy.steps.forEach((step) => {
          prepTime = prepTime + (step.timeActive + step.timePassive);
        });
        return prepTime <= maxTime;
      });
    }
    if (filters.search.length) {
      _recipies = _recipies.filter((recipy) =>
        recipy.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    this.filteredRecipies = _recipies.length;
    return this.applySorting(_recipies, filters.sorting, filters.sortingDirection);
  }

  applySorting(recipies: Recipy[], sorting: RecipySorting, sortingDirection: RecipySortingDirection) {
    let _recipies: Recipy[] = [];
    switch (sorting) {
      case RecipySorting.Default: _recipies = recipies;
        break;
      case RecipySorting.ByLastPrepared: _recipies = this.sortByLastPrepared(recipies);
        break;
      case RecipySorting.ByTotalPreparationTime: _recipies = this.sortByTotalPreparationTime(recipies);
        break;
      case RecipySorting.ByActivePreparationTime: _recipies = this.sortByActivePreparationTime(recipies);
        break;
    }
    if (sortingDirection === RecipySortingDirection.BigToSmall) {
      _recipies.reverse()
    }
    return _recipies
  }

  sortByTotalPreparationTime(recipies: Recipy[]) {
    const cloned = _.cloneDeep(recipies);
    cloned.sort((a, b) => getPreparationTime(a) - getPreparationTime(b));
    return cloned
  }
  sortByActivePreparationTime(recipies: Recipy[]) {
    const cloned = _.cloneDeep(recipies);
    cloned.sort((a, b) => getActivePreparationTime(a) - getActivePreparationTime(b));
    return cloned
  }

  sortByLastPrepared(recipies: Recipy[]) {
    const cloned = _.cloneDeep(recipies);
    const mapped = cloned.map(recipy => this.addLastPrepared(recipy, this.userPlannedRecipies));
    const sorted = this.getSortedByLastPrepared(mapped as Recipy[]);
    return sorted

  }

  getSortedByLastPrepared(recipies: Recipy[]) {
    const cloned = _.cloneDeep(recipies);
    cloned.sort((a, b) => this._sortByLastPrepared(a, b));
    return cloned
  }

  _sortByLastPrepared(a: Recipy, b: Recipy) {
    if (!a.lastPrepared && !b.lastPrepared) {
      return 0
    } 
    if (!a.lastPrepared) {
      return -1
    }
    if (!b.lastPrepared) {
      return 1
    }
    if (moment(a.lastPrepared, 'DDMMYYYY').clone().isAfter(moment(b.lastPrepared, 'DDMMYYYY').clone())) {
      return 1
    } else {
      return -1
    }
  }

  addLastPrepared(recipy: Recipy, allPlannedRecipies: CalendarRecipyInDatabase_Reworked[] | undefined) {
    let updated = {
      ...recipy,
      lastPrepared: allPlannedRecipies ? getLastPreparedDate(recipy.id, allPlannedRecipies) : 'N/A'
    }
    return updated
  }

  applyFiltersToExpenses(expenseItems: ExpenseItem[], filters: Filters) {
    let expenses = expenseItems.map(expense => expense);
    if (!!filters.ingredientsToInclude.length) {
      expenses = expenses.filter(expenseItem => filters.ingredientsToInclude.includes(expenseItem.productId));

    }
    return expenses
  }

  onFiltersChange() {
    this.filters$.next(this.currentFilters);
  }

  toggleIngredsToshow(id: string) {
    this.currentFilters.ingredientsToInclude = this.processToggleIngredient(
      this.currentFilters.ingredientsToInclude,
      id
    );
    this.onFiltersChange();
  }
  toggleIngredsToNotshow(id: string) {
    this.currentFilters.ingredientsToExclude = this.processToggleIngredient(
      this.currentFilters.ingredientsToExclude,
      id
    );
    this.onFiltersChange();
  }

  toggleTagToShow(tag: number) {
    this.currentFilters.tagsToShow = this.processToggleTag(
      this.currentFilters.tagsToShow,
      tag
    );
    this.onFiltersChange();
  }

  toggleTagToExclude(tag: number) {
    this.currentFilters.tagsToExclude = this.processToggleTag(
      this.currentFilters.tagsToExclude,
      tag
    );
    this.onFiltersChange();
  }

  toggleCollectionToShow(collectionName: string) {
    this.currentFilters.collectionsToInclude = this.processToggleCollection(
      this.currentFilters.collectionsToInclude,
      collectionName
    );
    this.onFiltersChange()
  }

  processToggleIngredient(
    ingredientsArray: string[],
    ingredientId: string
  ): string[] {
    let _array = ingredientsArray.map((ingr) => ingr);
    if (_array.includes(ingredientId)) {
      _array = _array.filter((ingr) => ingr !== ingredientId);
    } else {
      _array.push(ingredientId);
    }
    return _array;
  }

  processToggleTag(tagsArray: number[], tagId: number): number[] {
    let _array = tagsArray.map((tag) => tag);
    if (_array.includes(tagId)) {
      _array = _array.filter((tag) => tag !== tagId);
    } else {
      _array.push(tagId);
    }
    return _array;
  }

  processToggleCollection(collectionsArray: string[], collectionName: string): string[] {
    let _array = collectionsArray.map((collection) => collection);
    if (_array.includes(collectionName)) {
      _array = _array.filter((collection) => collection !== collectionName);
    } else {
      _array.push(collectionName);
    }
    return _array;
  }

  toggleSearch(word: string) {
    this.currentFilters.search = word;
    this.onFiltersChange();
  }

  toggleSorting(value: RecipySorting){
    this.currentFilters.sorting = value;
    this.onFiltersChange();
  }

  toggleSortingDirection(){
    if(this.currentFilters.sortingDirection === RecipySortingDirection.SmallToBig){
      this.currentFilters.sortingDirection = RecipySortingDirection.BigToSmall;
    } else {
      this.currentFilters.sortingDirection = RecipySortingDirection.SmallToBig;
    }
    this.onFiltersChange()
  }

  resetFilters() {
    this.currentFilters = _.cloneDeep(this.clearedFilters);
    this.filters$.next(this.clearedFilters);
  }

  get isShowWidget(){
    return this.currentFilters.ingredientsToInclude.length ||
    this.currentFilters.ingredientsToExclude.length ||
    this.currentFilters.tagsToShow.length ||
    this.currentFilters.tagsToExclude.length ||
    !!this.currentFilters.maxPrepTime || this.currentFilters.collectionsToInclude.length
  }
}
