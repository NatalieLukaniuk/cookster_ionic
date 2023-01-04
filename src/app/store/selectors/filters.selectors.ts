import { createSelector } from '@ngrx/store';
import { IAppState } from '../reducers';
import { FiltersState } from '../reducers/filters.reducers';

const getFiltersState = (state: IAppState) => state.filters;

export const getFilters = createSelector(
  getFiltersState,
  (state: FiltersState) => {
    return {
      ingredientsToInclude: state.ingredientsToInclude,
      ingredientsToExclude: state.ingredientsToExclude,
      tags: state.tags,
      maxPrepTime: state.maxPrepTime,
      search: state.search,
    };
  }
);
