import { ProductsService } from 'src/app/services/products.service';
import { DataMappingService } from 'src/app/services/data-mapping.service';
import { Product } from 'src/app/models/recipies.models';
import { FiltersService } from './../../services/filters.service';
import { Component, computed, inject, Input, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { RecipiesService } from 'src/app/services/recipies.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent {
  productsService = inject(ProductsService);
  recipiesService = inject(RecipiesService);
  userDataService = inject(UserDataService);
  filtersService = inject(FiltersService)
  

  @Input() pageId: string = '';

  $products = this.productsService.getProducts;
  $sortedProducts = this.productsService.getSortedProducts;
  $filteredRecipiesCount = this.recipiesService.recipiesWithFilterEnabledCount;
  
  $userCollections = computed(() => this.userDataService.userRecipeCollections().map(item => item.name));
  $isUserLoggedIn = this.userDataService.isUserLoggedIn;
  $isShowWidget = this.filtersService.isShowWidget;

  constructor(
    private datamapping: DataMappingService
  ) { }


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

}
