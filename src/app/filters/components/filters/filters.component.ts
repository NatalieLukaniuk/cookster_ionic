import { ProductsService } from 'src/app/services/products.service';
import { DataMappingService } from 'src/app/services/data-mapping.service';
import { DishType, Product } from 'src/app/models/recipies.models';
import { FiltersService } from './../../services/filters.service';
import { Component, computed, inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { map, Observable, Subscription, tap } from 'rxjs';
import { IAppState } from 'src/app/store/reducers';
import { RecipiesService } from 'src/app/services/recipies.service';
import { getUserCollections, getUserPlannedRecipies } from 'src/app/store/selectors/user.selectors';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit, OnDestroy {
  productsService = inject(ProductsService);
  recipiesService = inject(RecipiesService);

  @Input() isExpensePage = false;
  @Input() pageId: string = '';
  @Input() isUserLoggedIn = false;

  $products = this.productsService.getProducts;
  $sortedProducts = this.productsService.getSortedProducts;
  $filteredRecipiesCount = this.recipiesService.recipiesWithFilterEnabledCount;
  
  userCollections$ = this.store.pipe(select(getUserCollections)).pipe(map(collections => collections?.length? collections.map(item => item.name) : [])) //TODO needs to be signal from userdata service

  subscription = new Subscription();

  constructor(
    public filtersService: FiltersService,
    private store: Store<IAppState>,
    private datamapping: DataMappingService
  ) { }
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  ngOnInit() {
    this.subscription.add(this.store.pipe(select(getUserPlannedRecipies)).subscribe()) //TODO needs to be signal from userdata service
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

  get isShowWidget(){
    return this.filtersService.isShowWidget
  }

}
