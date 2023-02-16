import { Filters } from 'src/app/models/filters.models';
import { Observable, combineLatest, map, shareReplay } from 'rxjs';
import { Injectable } from '@angular/core';
import { Recipy } from 'src/app/models/recipies.models';
import { Store, select } from '@ngrx/store';
import { IAppState } from 'src/app/store/reducers';
import { getFilters } from 'src/app/store/selectors/filters.selectors';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  filteredRecipies: number = 0;
  constructor(private store: Store<IAppState>) {}
  recipies$ = this.store.pipe(select(getAllRecipies));

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
        recipy.name.includes(filters.search)
      );
    }
    this.filteredRecipies = _recipies.length;
    return _recipies;
  }
}
