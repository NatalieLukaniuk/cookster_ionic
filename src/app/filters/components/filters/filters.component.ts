import { DataMappingService } from 'src/app/services/data-mapping.service';
import { DishType, Product } from 'src/app/models/recipies.models';
import { FiltersService } from './../../services/filters.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { map, Observable, tap } from 'rxjs';
import { IAppState } from 'src/app/store/reducers';
import { getAllProducts } from 'src/app/store/selectors/recipies.selectors';

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

  checkedTags: number[] = [];

  tags: number[] = [];

  gettags() {
    let tags: number[] = [];
    tags = Object.values(DishType).filter(
      (value) => typeof value === 'number'
    ) as number[];
    return tags;
  }

  checkedTags$ = this.filtersService.getFilters.pipe(
    map((res) => res.tags),
    tap((res) => (this.checkedTags = res))
  );

  constructor(
    public filtersService: FiltersService,
    private store: Store<IAppState>,
    private datamapping: DataMappingService
  ) {}

  ngOnInit() {
    this.tags = this.gettags();
  }

  @ViewChild(IonModal) modal: IonModal | undefined;

  cancel() {
    this.filtersService.resetFilters();
    this.modal?.dismiss();
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
    this.filtersService.toggleIngredsToshow(event.id);
    this.withAutocomplete.clearSearch();
  }

  addToDisplayWithout(event: Product) {
    this.filtersService.toggleIngredsToNotshow(event.id);
    this.withoutAutocomplete.clearSearch();
  }

  getTagsText(tag: DishType) {
    return DishType[tag];
  }

  onTagCheck(tag: DishType) {
    this.filtersService.toggleTag(tag);
  }
}
