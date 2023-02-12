import { AddNewIngredientAction } from './../../../../store/actions/recipies.actions';
import { Store } from '@ngrx/store';
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
  ProductTypeOptions,
  ProductTypeText,
} from 'src/app/models/recipies.models';
import { IAppState } from 'src/app/store/reducers';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  productForm!: UntypedFormGroup;
  constructor(
    private productsApi: ProductsApiService,
    private store: Store<IAppState>
  ) {}

  ngOnInit(): void {
    this.productForm = new UntypedFormGroup({
      name: new UntypedFormControl('', Validators.required),
      density: new UntypedFormControl('', Validators.required),
      grInOneItem: new UntypedFormControl('', Validators.required),
      calories: new UntypedFormControl('', Validators.required),
      defaultUnit: new UntypedFormControl('', Validators.required),
      type: new UntypedFormControl('', Validators.required),
    });
  }

  get measuringUnits(): MeasuringUnit[] {
    return MeasuringUnitOptions;
  }

  getMeasuringUnitText(unit: any) {
    return MeasuringUnit[unit];
  }

  get productTypes() {
    return ProductTypeOptions;
  }

  getProductTypeText(type: number) {
    return ProductTypeText[type];
  }

  submit() {
    this.productsApi
      .addProduct(this.productForm.value)
      .subscribe((res: { name: string }) => {
        this.store.dispatch(
          new AddNewIngredientAction({
            ...this.productForm.value,
            product: res.name,
          })
        );
      });
  }
}
