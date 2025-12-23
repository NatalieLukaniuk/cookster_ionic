import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, map, Observable, take } from 'rxjs';
import { MeasuringUnitText, Product, ProductTypeText } from 'src/app/models/recipies.models';
import { IAppState } from 'src/app/store/reducers';
import { getAllProducts } from 'src/app/store/selectors/recipies.selectors';
import { AdminService } from '../../services/admin.service';
import { ProductsApiService } from 'src/app/services/products-api.service';
import { ProductsLoadedAction } from 'src/app/store/actions/recipies.actions';

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

  isShowDensityCalculator = false;

  constructor(private store: Store<IAppState>, private adminService: AdminService, private productsService: ProductsApiService) { }

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
    const values: Product = this.productForm.value;
    const changes = this.detectChange(values);
    if (changes.find(entry => entry[0] === 'density') && this.selectedProduct) {
      this.adminService.updateRecipiesOnDensityChange(this.selectedProduct, this.productForm.value['density'])
    }
    const mappedValues: { [key: string]: any } = {};
    Object.entries(values).map(entryPair => {
      if (entryPair[0] !== 'name') {
        return [entryPair[0], +entryPair[1]]
      } else {
        return entryPair
      }
    }).forEach(entry => mappedValues[entry[0]] = entry[1])
    mappedValues['id'] = this.selectedProduct?.id;
    this.productsService.updateProduct(this.selectedProduct!.id, mappedValues as Product).pipe(take(1)).subscribe(res => {
      this.store.pipe(select(getAllProducts), take(1)).subscribe(allProducts => {
        const updated = allProducts.map(prod => {
          if (prod.id === this.selectedProduct!.id) {
            return res
          } else return prod
        })
        this.store.dispatch(new ProductsLoadedAction(updated))
      })
    })
  }

  trackFormChanges() {
    this.formSubscription = this.productForm.valueChanges.subscribe(res => {

      const changes = this.detectChange(res)
      if (changes.length) {
        this.nochanges$.next(false)
      } else {
        this.nochanges$.next(true)
      }
    })
  }

  detectChange(formValues: Product) {
    if (this.selectedProduct) {
      return Object.entries(formValues).map(entryPair => {
        if (entryPair[0] !== 'name') {
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
