import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FiltersService } from '../../services/filters.service';
import { BehaviorSubject, debounce, debounceTime, Subscription } from 'rxjs';

@Component({
  selector: 'app-search-recipies-filter',
  templateUrl: './search-recipies-filter.component.html',
  styleUrls: ['./search-recipies-filter.component.scss'],
})
export class SearchRecipiesFilterComponent implements OnInit, OnDestroy {
  @Input() isClearOnDestroy = true;

  searchInput$ = new BehaviorSubject<string>('')

  value = '';

  sub = new Subscription();

  constructor(private filtersService: FiltersService) { }
  ngOnDestroy(): void {
    if (this.isClearOnDestroy) {
      this.clear()
    }
    this.sub.unsubscribe()
  }

  ngOnInit() {
    this.value = this.filtersService.getCurrentFiltersValue().search;
    this.sub.add(this.searchInput$.pipe(
      debounceTime(100)
    ).subscribe(searchKey => {
      this.filtersService.toggleSearch(searchKey);
    }))
  }

  onSearch(event: any) {
    this.searchInput$.next(event.detail.value)
  }

  clear() {
    this.searchInput$.next('')
  }
}
