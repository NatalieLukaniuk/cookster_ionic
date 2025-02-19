import { map, pipe } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Filters, RecipySorting, RecipySortingDirection } from 'src/app/models/filters.models';
import { FiltersService } from '../../services/filters.service';

@Component({
  selector: 'app-sorting-filter',
  templateUrl: './sorting-filter.component.html',
  styleUrls: ['./sorting-filter.component.scss'],
})
export class SortingFilterComponent implements OnInit {

  sortingOptions = Object.values(RecipySorting).filter(entry => typeof(entry) === 'number');

  sortingDirection$ = this.filtersService.getFilters.pipe(map((filters: Filters) => filters.sortingDirection))
  sorting$ = this.filtersService.getFilters.pipe(map((filters: Filters) => filters.sorting))
  
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

  sortingValue: RecipySorting = RecipySorting.Default;

  constructor(private filtersService: FiltersService) { }

  ngOnInit() { }

  onSortingChange(event: any) {
    this.filtersService.toggleSorting(event.detail.value)
  }

  toggleSortingDirection() {
    this.filtersService.toggleSortingDirection()
  }


}
