import { ShowSuccessMessageAction } from './../../../../store/actions/ui.actions';
import { AddNewIngredientAction } from './../../../../store/actions/recipies.actions';
import { Store, select } from '@ngrx/store';
import { ProductsApiService } from './../../../../services/products-api.service';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  MeasuringUnit,
  MeasuringUnitOptions,
  MeasuringUnitText,
  Product,
  ProductTypeOptions,
  ProductTypeText,
} from 'src/app/models/recipies.models';
import { IAppState } from 'src/app/store/reducers';
import { Observable, map } from 'rxjs';
import { getAllProducts } from 'src/app/store/selectors/recipies.selectors';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent {
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
  
  constructor(    
    private store: Store<IAppState>
  ) {} 
}
