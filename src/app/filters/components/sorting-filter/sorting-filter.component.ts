import { map, pipe } from 'rxjs';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Filters, RecipySorting, RecipySortingDirection } from 'src/app/models/filters.models';
import { FiltersService } from '../../services/filters.service';

export const DEFAULT_SORTING = RecipySorting.Default;
export const DEFAULT_SORTING_DIRECTION = RecipySortingDirection.SmallToBig;

@Component({
  selector: 'app-sorting-filter',
  templateUrl: './sorting-filter.component.html',
  styleUrls: ['./sorting-filter.component.scss'],
})
export class SortingFilterComponent implements OnChanges {
  @Input() isUserLoggedIn = false;

  sortingOptions = Object.values(RecipySorting).filter(entry => typeof (entry) === 'number');

  sortingDirection$ = this.filtersService.getFilters.pipe(map((filters: Filters) => filters.sortingDirection))
  sorting$ = this.filtersService.getFilters.pipe(map((filters: Filters) => filters.sorting))

  excludedSortingOptions: any[] = []

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

  constructor(private filtersService: FiltersService) { }

  ngOnChanges() {
    if (!this.isUserLoggedIn) {
      this.excludedSortingOptions = [RecipySorting.ByLastPrepared]
    } else {
      this.excludedSortingOptions = []
    }
    this.sortingOptions = this.sortingOptions.filter((option) => !this.excludedSortingOptions.includes(option))
  }

  onSortingChange(event: any) {
    this.filtersService.toggleSorting(event.detail.value)
  }

  toggleSortingDirection() {
    this.filtersService.toggleSortingDirection()
  }




}
