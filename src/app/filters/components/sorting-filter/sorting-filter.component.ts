import { Component, computed, inject, input } from '@angular/core';
import { RecipySorting, RecipySortingDirection } from 'src/app/models/filters.models';
import { FiltersService } from '../../services/filters.service';

export const DEFAULT_SORTING = RecipySorting.Default;
export const DEFAULT_SORTING_DIRECTION = RecipySortingDirection.SmallToBig;

@Component({
  selector: 'app-sorting-filter',
  templateUrl: './sorting-filter.component.html',
  styleUrls: ['./sorting-filter.component.scss'],
})
export class SortingFilterComponent {
  filtersService = inject(FiltersService);
  isUserLoggedIn = input(false);

  excludedSortingOptions = computed(() => this.isUserLoggedIn()? [] : [RecipySorting.ByLastPrepared]);

  sortingOptions = computed(() => Object.values(RecipySorting)
  .filter(entry => typeof (entry) === 'number')
  .filter((option) => !this.excludedSortingOptions().includes(option as RecipySorting))) ;

  $sortingDirection = computed(() => this.filtersService.getCurrentFilters().sortingDirection);
  $sorting = computed(() => this.filtersService.getCurrentFilters().sorting);

  getOptionLabel(value: RecipySorting | string): string {
    switch (value) {
      case RecipySorting.Default: return 'датою додавання';
      case RecipySorting.ByActivePreparationTime: return 'активним часом приготування';
      case RecipySorting.ByLastPrepared: return 'останнім приготуванням';
      case RecipySorting.ByTotalPreparationTime: return 'загальним часом приготування';
      default: return ''
    }
  }

  RecipySortingDirection = RecipySortingDirection;

  sortingValue: RecipySorting = DEFAULT_SORTING;

  onSortingChange(event: any) {
    this.filtersService.toggleSorting(event.detail.value)
  }

  toggleSortingDirection() {
    this.filtersService.toggleSortingDirection()
  }




}
