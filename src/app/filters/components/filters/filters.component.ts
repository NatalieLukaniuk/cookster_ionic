import { DataMappingService } from 'src/app/services/data-mapping.service';
import { DishType, Product } from 'src/app/models/recipies.models';
import { FiltersService } from './../../services/filters.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { tap, map, Observable } from 'rxjs';
import { IAppState } from 'src/app/store/reducers';
import { getAllProducts } from 'src/app/store/selectors/recipies.selectors';
import {
  ToggleIngredientToExcludeAction,
  ToggleIngredientToIncludeAction,
  ToggleTagAction,
} from 'src/app/store/actions/filters.actions';
import { getFilters } from 'src/app/store/selectors/filters.selectors';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit {
  products: Product[] = [];
  products$: Observable<Product[]> = this.store.pipe(
    select(getAllProducts),
    map((res) => {
      if (res) {
        let products = res.map((i) => i);
        products.sort((a, b) => a.name.localeCompare(b.name));
        this.products = products;
        return products;
      } else return [];
    })
  );

  get tags() {
    let tags: number[] = [];
    tags = Object.values(DishType).filter(
      (value) => typeof value === 'number'
    ) as number[];
    return tags;
  }

  checkedTags$ = this.store.pipe(
    select(getFilters),
    map((res) => res.tags)
  );

  constructor(
    public filtersService: FiltersService,
    private store: Store<IAppState>,
    private datamapping: DataMappingService
  ) {}

  ngOnInit() {}

  @ViewChild(IonModal) modal: IonModal | undefined;

  cancel() {
    this.modal?.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal?.dismiss();
  }

  getProductText(product: Product): string {
    return this.datamapping.getProductNameById(product.id);
  }

  @ViewChild('withAutocomplete') withAutocomplete: any;
  @ViewChild('withoutAutocomplete') withoutAutocomplete: any;

  addToDisplayWith(event: Product) {
    this.store.dispatch(new ToggleIngredientToIncludeAction(event.id));
    this.withAutocomplete.clearSearch();
  }

  addToDisplayWithout(event: Product) {
    this.store.dispatch(new ToggleIngredientToExcludeAction(event.id));
    this.withoutAutocomplete.clearSearch();
  }

  getTagsText(tag: DishType) {
    return DishType[tag];
  }

  onTagCheck(tag: DishType) {
    this.store.dispatch(new ToggleTagAction(tag));
  }
}
