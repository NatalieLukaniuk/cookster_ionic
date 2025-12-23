import { FiltersService } from './../../services/filters.service';
import { DataMappingService } from 'src/app/services/data-mapping.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';
import { Filters, RecipySorting, RecipySortingDirection } from 'src/app/models/filters.models';
import { Product, DishType } from 'src/app/models/recipies.models';

import { areObjectsEqual } from 'src/app/services/comparison';
import { DEFAULT_SORTING, DEFAULT_SORTING_DIRECTION } from '../sorting-filter/sorting-filter.component';

@Component({
  selector: 'app-active-filters-widget',
  templateUrl: './active-filters-widget.component.html',
  styleUrls: ['./active-filters-widget.component.scss'],
})
export class ActiveFiltersWidgetComponent implements OnDestroy {
  destroy$ = new Subject<void>();
  currentFilters: Filters | undefined;
  products: Product[] = [];

  DEFAULT_SORTING = DEFAULT_SORTING;
  DEFAULT_SORTING_DIRECTION = DEFAULT_SORTING_DIRECTION;
  RecipySortingDirection = RecipySortingDirection;

  constructor(
    public recipiesService: DataMappingService,
    private filtersService: FiltersService
  ) {
    this.filtersService.getFilters
      .pipe(takeUntil(this.destroy$))
      .subscribe((filters) => {
        if (
          !this.currentFilters ||
          !areObjectsEqual(this.currentFilters, filters)
        ) {
          this.currentFilters = filters;
        }
      });
    this.recipiesService.products$.subscribe((products: Product[]) => {
      this.products = products;
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }

  getTagsText(tag: DishType) {
    return DishType[tag];
  }

  removeTagToShow(tag: DishType) {
    this.filtersService.toggleTagToShow(tag);
  }

  removeTagToExclude(tag: DishType) {
    this.filtersService.toggleTagToExclude(tag);
  }

  removeIngrToInclude(tag: string) {
    this.filtersService.toggleIngredsToshow(tag);
  }
  removeIngrToExclude(tag: string) {
    this.filtersService.toggleIngredsToNotshow(tag);
  }

  getIngredientText(ingr: string): string {
    return this.recipiesService.getProductNameById(ingr);
  }

  removeCollection(collection: string) {
    this.filtersService.toggleCollectionToShow(collection)
  }

  get isShowWidget() {
    return this.filtersService.isShowWidget
  }

  removeSearch() {
    this.filtersService.clearSearch()
  }

  getOptionLabel(value: RecipySorting | string): string {
    switch (value) {
      case RecipySorting.Default: return 'за датою додавання';
      case RecipySorting.ByActivePreparationTime: return 'за активним часом приготування';
      case RecipySorting.ByLastPrepared: return 'за останнім приготуванням';
      case RecipySorting.ByTotalPreparationTime: return 'за загальним часом приготування';
      default: return ''
    }
  }

  clearSorting(){
    this.filtersService.resetSortingToDefault()
  }
}
