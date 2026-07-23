import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { MeasuringUnit, MeasuringUnitOptions, MeasuringUnitText, ProductTypeOptions, ProductTypeText } from 'src/app/models/recipies.models';

import { ProductsService } from 'src/app/services/products.service';
import { UiService } from 'src/app/services/ui.service';


@Component({
  selector: 'app-add-product-form',
  templateUrl: './add-product-form.component.html',
  styleUrls: ['./add-product-form.component.scss']
})
export class AddProductFormComponent implements OnInit {
  uiService = inject(UiService);
  productsService = inject(ProductsService)

  productForm!: UntypedFormGroup;

  @Output() productAdded = new EventEmitter<void>();

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

    this.productsService.addNewProduct(productToAdd);
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
