import { DataMappingService } from 'src/app/services/data-mapping.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { Filters } from 'src/app/models/filters.models';
import { Product, DishType } from 'src/app/models/recipies.models';
import { IAppState } from 'src/app/store/reducers';
import { getFilters } from 'src/app/store/selectors/filters.selectors';
import { areObjectsEqual } from 'src/app/services/comparison';
import { ToggleIngredientToExcludeAction, ToggleIngredientToIncludeAction, ToggleTagAction } from 'src/app/store/actions/filters.actions';

@Component({
  selector: 'app-active-filters-widget',
  templateUrl: './active-filters-widget.component.html',
  styleUrls: ['./active-filters-widget.component.scss']
})
export class ActiveFiltersWidgetComponent implements OnDestroy {

  destroy$ = new Subject<void>();
  currentFilters: Filters | undefined;
  products: Product[] = [];

  constructor(
    private store: Store<IAppState>,
    public recipiesService: DataMappingService
  ) {
    this.store
      .pipe(select(getFilters), takeUntil(this.destroy$))
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
    this.store.dispatch(new ToggleTagAction(tag));
  }

  removeIngrToInclude(tag: string) {
    this.store.dispatch(
      new ToggleIngredientToIncludeAction(tag)
    );
  }
  removeIngrToExclude(tag: string) {
    this.store.dispatch(
      new ToggleIngredientToExcludeAction(tag)
    );
  }

  getIngredientText(ingr: string): string {
    return this.recipiesService.getProductNameById(ingr);
  }

}
