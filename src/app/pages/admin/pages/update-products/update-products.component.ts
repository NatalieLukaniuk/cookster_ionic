import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { MeasuringUnitText, Product, ProductTypeText } from 'src/app/models/recipies.models';
import { IAppState } from 'src/app/store/reducers';
import { getAllProducts } from 'src/app/store/selectors/recipies.selectors';

@Component({
  selector: 'app-update-products',
  templateUrl: './update-products.component.html',
  styleUrls: ['./update-products.component.scss']
})
export class UpdateProductsComponent implements OnInit {

  selectedProduct: Product | null = null;

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

  nochanges$ = new BehaviorSubject<boolean>(true);

  formSubscription: any;

  constructor(private store: Store<IAppState>,) { }

  onProductSelected(selected: Product) {
    this.selectedProduct = selected;
    console.log(this.selectedProduct)
    this.initForm(this.selectedProduct)
  }

  ngOnInit() {
  }

  initForm(product: Product) {
    this.productForm = new UntypedFormGroup({
      calories: new UntypedFormControl(product.calories, [
        Validators.required,
      ]),
      defaultUnit: new UntypedFormControl(product.defaultUnit, [
        Validators.required,
      ]),
      density: new UntypedFormControl(product.density, [
        Validators.required,
      ]),
      grInOneItem: new UntypedFormControl(product.grInOneItem, [
        Validators.required,
      ]),
      name: new UntypedFormControl(product.name, [
        Validators.required,
      ]),
      type: new UntypedFormControl(product.type, [
        Validators.required,
      ]),
      sizeChangeCoef: new UntypedFormControl(product.sizeChangeCoef, [
        Validators.required,
      ]),
    });
    this.trackFormChanges();

  }

  submit() {

  }

  trackFormChanges() {
    this.formSubscription = this.productForm.valueChanges.subscribe(res => {
      
      const changes = this.detectChange(res)
      if(changes.length){
        this.nochanges$.next(false)
      } else {
        this.nochanges$.next(true)
      }
    })
  }

  detectChange(formValues: Product){
    if(this.selectedProduct){
      return Object.entries(formValues).map(entryPair => {
        if(entryPair[0] !== 'name'){
          return [entryPair[0], +entryPair[1]]
        } else {
          return entryPair
        }
      }).filter(formKeyPair => formKeyPair[1] !== this.selectedProduct![formKeyPair[0] as keyof Product])
    } else {
      return []
    }

  }

  getMeasuringUnitText(unit: any) {
      return MeasuringUnitText[unit];
    }

    getProductTypeText(type: number) {
        return ProductTypeText[type];
      }

}
