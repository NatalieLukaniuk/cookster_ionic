import { Component, OnDestroy, OnInit } from '@angular/core';
import { FiltersService } from '../../services/filters.service';

@Component({
  selector: 'app-search-recipies-filter',
  templateUrl: './search-recipies-filter.component.html',
  styleUrls: ['./search-recipies-filter.component.scss'],
})
export class SearchRecipiesFilterComponent implements OnInit, OnDestroy {

  constructor(private filtersService: FiltersService) { }
  ngOnDestroy(): void {
    this.clear()
  }

  ngOnInit() {}
  onSearch(event: any) {
    this.filtersService.toggleSearch(event.detail.value);
  }

  clear() {
    this.filtersService.toggleSearch('');
  }
}
