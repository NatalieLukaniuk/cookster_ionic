import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { SetSearchWordAction } from 'src/app/store/actions/filters.actions';
import { IAppState } from 'src/app/store/reducers';

@Component({
  selector: 'app-search-recipies-filter',
  templateUrl: './search-recipies-filter.component.html',
  styleUrls: ['./search-recipies-filter.component.css'],
})
export class SearchRecipiesFilterComponent implements OnInit {
  constructor(private store: Store<IAppState>) {}

  ngOnInit() {}
  onSearch(event: any) {
    this.store.dispatch(new SetSearchWordAction(event.detail.value));
  }

  clear(){
    this.store.dispatch(new SetSearchWordAction(''));
  }
}
