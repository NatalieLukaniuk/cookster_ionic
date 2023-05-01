import { FiltersService } from './../../services/filters.service';
import { DataMappingService } from 'src/app/services/data-mapping.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';
import { Filters } from 'src/app/models/filters.models';
import { Product, DishType } from 'src/app/models/recipies.models';

import { areObjectsEqual } from 'src/app/services/comparison';

@Component({
  selector: 'app-active-filters-widget',
  templateUrl: './active-filters-widget.component.html',
  styleUrls: ['./active-filters-widget.component.scss'],
})
export class ActiveFiltersWidgetComponent implements OnDestroy {
  destroy$ = new Subject<void>();
  currentFilters: Filters | undefined;
  products: Product[] = [];

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

  removeTag(tag: DishType) {
    this.filtersService.toggleTag(tag);
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
}
