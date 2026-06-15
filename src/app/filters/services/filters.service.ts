import { DEFAULT_SORTING, DEFAULT_SORTING_DIRECTION } from './../components/sorting-filter/sorting-filter.component';
import { Filters, RecipySorting, RecipySortingDirection } from 'src/app/models/filters.models';
import { Subject } from 'rxjs';
import { computed, Injectable, signal } from '@angular/core';

const clearedFilters: Filters = {
  ingredientsToExclude: [],
  ingredientsToInclude: [],
  maxPrepTime: 0,
  tagsToShow: [],
  tagsToExclude: [],
  collectionsToInclude: [],
  search: '',
  sorting: DEFAULT_SORTING,
  sortingDirection: DEFAULT_SORTING_DIRECTION
};

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  private currentFilters = signal<Filters>(clearedFilters);
  getCurrentFilters = this.currentFilters.asReadonly();

  isShowWidget = computed(() => {
    return !!(this.currentFilters().ingredientsToInclude.length ||
      this.currentFilters().ingredientsToExclude.length ||
      this.currentFilters().tagsToShow.length ||
      this.currentFilters().tagsToExclude.length ||
      !!this.currentFilters().maxPrepTime ||
      this.currentFilters().collectionsToInclude.length ||
      this.currentFilters().search.length ||
      this.currentFilters().sorting !== DEFAULT_SORTING ||
      this.currentFilters().sortingDirection !== DEFAULT_SORTING_DIRECTION)
  })

  clearSearch$ = new Subject<void>();

  clearSearch() {
    this.toggleSearch('');
    this.clearSearch$.next()
  }

  private updateFilters(update: Partial<Filters>) {
    this.currentFilters.update(prev => ({
      ...prev,
      update
    }))
  }

  toggleIngredsToshow(id: string) {
    const ingredientsToInclude = this.processToggleIngredient(
      this.currentFilters().ingredientsToInclude,
      id
    );
    this.updateFilters({ ingredientsToInclude });
  }

  toggleIngredsToNotshow(id: string) {
    const ingredientsToExclude = this.processToggleIngredient(
      this.currentFilters().ingredientsToExclude,
      id
    );
    this.updateFilters({ ingredientsToExclude });
  }

  toggleTagToShow(tag: number) {
    const tagsToShow = this.processToggleTag(
      this.currentFilters().tagsToShow,
      tag
    );
    this.updateFilters({ tagsToShow });
  }

  toggleTagToExclude(tag: number) {
    const tagsToExclude = this.processToggleTag(
      this.currentFilters().tagsToExclude,
      tag
    );
    this.updateFilters({ tagsToExclude });
  }

  toggleCollectionToShow(collectionName: string) {
    const collectionsToInclude = this.processToggleCollection(
      this.currentFilters().collectionsToInclude,
      collectionName
    );
    this.updateFilters({ collectionsToInclude })
  }

  toggleSearch(word: string) {
    this.updateFilters({ search: word });
  }

  toggleSorting(value: RecipySorting) {
    this.updateFilters({ sorting: value });
  }

  toggleSortingDirection() {
    const sortingDirection = this.currentFilters().sortingDirection === RecipySortingDirection.SmallToBig ?
      RecipySortingDirection.BigToSmall : RecipySortingDirection.SmallToBig;

    this.updateFilters({ sortingDirection })
  }

  resetSortingToDefault() {
    this.updateFilters({
      sorting: DEFAULT_SORTING,
      sortingDirection: DEFAULT_SORTING_DIRECTION
    })
  }

  resetFilters() {
    this.updateFilters(clearedFilters)
  }


  private processToggleIngredient(
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

  private processToggleTag(tagsArray: number[], tagId: number): number[] {
    let _array = tagsArray.map((tag) => tag);
    if (_array.includes(tagId)) {
      _array = _array.filter((tag) => tag !== tagId);
    } else {
      _array.push(tagId);
    }
    return _array;
  }

  private processToggleCollection(collectionsArray: string[], collectionName: string): string[] {
    let _array = collectionsArray.map((collection) => collection);
    if (_array.includes(collectionName)) {
      _array = _array.filter((collection) => collection !== collectionName);
    } else {
      _array.push(collectionName);
    }
    return _array;
  }
}
