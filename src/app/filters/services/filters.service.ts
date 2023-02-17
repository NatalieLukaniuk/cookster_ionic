import { Filters } from 'src/app/models/filters.models';
import { BehaviorSubject, shareReplay, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { Recipy } from 'src/app/models/recipies.models';
import { Store, select } from '@ngrx/store';
import { IAppState } from 'src/app/store/reducers';

import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  filteredRecipies: number = 0;
  constructor(private store: Store<IAppState>) {}
  recipies$ = this.store.pipe(select(getAllRecipies));

  clearedFilters: Filters = {
    ingredientsToExclude: [],
    ingredientsToInclude: [],
    maxPrepTime: 0,
    tags: [],
    search: '',
  };

  currentFilters: Filters = _.cloneDeep(this.clearedFilters);

  filters$: BehaviorSubject<Filters> = new BehaviorSubject(this.clearedFilters);

  getFilters = this.filters$.asObservable().pipe(shareReplay(1));

  applyFilters(recipies: Recipy[], filters: Filters) {
    let _recipies = recipies.map((recipy) => recipy);

    _recipies = _recipies.filter((recipy) => !recipy.notApproved);

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
    if (!!filters.tags.length) {
      _recipies = _recipies.filter((recipy) => {
        return filters.tags.every((tag) => recipy.type.includes(tag));
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
    return _recipies;
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
  toggleTag(tag: number) {
    this.currentFilters.tags = this.processToggleTag(
      this.currentFilters.tags,
      tag
    );
    this.onFiltersChange();
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

  toggleSearch(word: string) {
    this.currentFilters.search = word;
    this.onFiltersChange();
  }

  resetFilters() {
    this.currentFilters = _.cloneDeep(this.clearedFilters);
    this.filters$.next(this.clearedFilters);
  }
}
