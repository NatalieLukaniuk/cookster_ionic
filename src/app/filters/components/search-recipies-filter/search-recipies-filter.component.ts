import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FiltersService } from '../../services/filters.service';

@Component({
  selector: 'app-search-recipies-filter',
  templateUrl: './search-recipies-filter.component.html',
  styleUrls: ['./search-recipies-filter.component.scss'],
})
export class SearchRecipiesFilterComponent implements OnInit, OnDestroy {
  @Input() isClearOnDestroy = true;

  value = ''

  constructor(private filtersService: FiltersService) { }
  ngOnDestroy(): void {
    if (this.isClearOnDestroy) {
      this.clear()
    }
  }

  ngOnInit() {
    this.value = this.filtersService.currentFilters.search;
  }

  onSearch(event: any) {
    this.filtersService.toggleSearch(event.detail.value);
  }

  clear() {
    this.filtersService.toggleSearch('');
  }
}
