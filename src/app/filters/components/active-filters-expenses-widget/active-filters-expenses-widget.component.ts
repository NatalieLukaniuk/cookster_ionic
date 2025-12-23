import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Filters } from 'src/app/models/filters.models';
import { areObjectsEqual } from 'src/app/services/comparison';
import { FiltersService } from '../../services/filters.service';
import { DataMappingService } from 'src/app/services/data-mapping.service';

@Component({
  selector: 'app-active-filters-expenses-widget',
  templateUrl: './active-filters-expenses-widget.component.html',
  styleUrls: ['./active-filters-expenses-widget.component.scss']
})
export class ActiveFiltersExpensesWidgetComponent {
  destroy$ = new Subject<void>();
  currentFilters: Filters | undefined;
  constructor(
    private filtersService: FiltersService,
    public recipiesService: DataMappingService
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
  }

  removeIngrToInclude(tag: string) {
    this.filtersService.toggleIngredsToshow(tag);
  }

  getIngredientText(ingr: string): string {
    return this.recipiesService.getProductNameById(ingr);
  }
}
