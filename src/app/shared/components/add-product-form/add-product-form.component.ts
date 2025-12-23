import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MeasuringUnit, MeasuringUnitOptions, MeasuringUnitText, ProductTypeOptions, ProductTypeText } from 'src/app/models/recipies.models';
import { ProductsApiService } from 'src/app/services/products-api.service';
import { AddNewIngredientAction } from 'src/app/store/actions/recipies.actions';
import { ShowSuccessMessageAction } from 'src/app/store/actions/ui.actions';
import { IAppState } from 'src/app/store/reducers';

@Component({
  selector: 'app-add-product-form',
  templateUrl: './add-product-form.component.html',
  styleUrls: ['./add-product-form.component.scss']
})
export class AddProductFormComponent implements OnInit {
  productForm!: UntypedFormGroup;

  @Output() productAdded = new EventEmitter<void>();

  constructor(private productsApi: ProductsApiService, private store: Store<IAppState>){}
  
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

  submit() {
    let productToAdd = {
      name: this.productForm.controls['name'].value,
      density: +this.productForm.controls['density'].value,
      calories: +this.productForm.controls['calories'].value,
      defaultUnit: this.productForm.controls['defaultUnit'].value,
      type: this.productForm.controls['type'].value,
      sizeChangeCoef: +this.productForm.controls['sizeChangeCoef'].value,
      grInOneItem: +this.productForm.controls['grInOneItem'].value
    };
    this.productsApi.addProduct(productToAdd).subscribe((res: { name: string }) => {
      this.store.dispatch(
        new AddNewIngredientAction({
          ...productToAdd,
          id: res.name,
        })
      );
      this.store.dispatch(
        new ShowSuccessMessageAction(`${productToAdd.name} додано`)
      );
    });
    this.clearForm();
  }

  clearForm() {
    this.initForm();
    this.productAdded.emit();
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
}
