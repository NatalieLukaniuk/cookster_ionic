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
export class AddProductComponent implements OnInit {
  productForm!: UntypedFormGroup;

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
    private productsApi: ProductsApiService,
    private store: Store<IAppState>
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.productForm = new UntypedFormGroup({
      name: new UntypedFormControl('', Validators.required),
      density: new UntypedFormControl('', Validators.required),
      grInOneItem: new UntypedFormControl('', Validators.required),
      calories: new UntypedFormControl('', Validators.required),
      defaultUnit: new UntypedFormControl('', Validators.required),
      type: new UntypedFormControl('', Validators.required),
      sizeChangeCoef: new UntypedFormControl('', Validators.required),
    });
  }

  get measuringUnits(): MeasuringUnit[] {
    return MeasuringUnitOptions;
  }

  getMeasuringUnitText(unit: any) {
    return MeasuringUnitText[unit];
  }

  get productTypes() {
    return ProductTypeOptions;
  }

  getProductTypeText(type: number) {
    return ProductTypeText[type];
  }

  submit() {
    let product = {
      name: this.productForm.controls['name'].value,
      density: +this.productForm.controls['density'].value,
      calories: +this.productForm.controls['calories'].value,
      defaultUnit: this.productForm.controls['defaultUnit'].value,
      type: this.productForm.controls['type'].value,
      sizeChangeCoef: +this.productForm.controls['sizeChangeCoef'].value,
      grInOneItem: +this.productForm.controls['grInOneItem'].value
    };
    this.productsApi.addProduct(product).subscribe((res: { name: string }) => {
      this.store.dispatch(
        new AddNewIngredientAction({
          ...this.productForm.value,
          product: res.name,
        })
      );
      this.store.dispatch(
        new ShowSuccessMessageAction(`${product.name} додано`)
      );
    });
    this.clearForm();
  }

  clearForm() {
    this.initForm();
  }
}
