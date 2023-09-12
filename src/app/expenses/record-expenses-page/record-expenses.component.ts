import { Component, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
import { MeasuringUnit, MeasuringUnitOptions, MeasuringUnitText, Product, ProductType } from 'src/app/models/recipies.models';
import { IAppState } from 'src/app/store/reducers';
import { getAllProducts } from 'src/app/store/selectors/recipies.selectors';
import { Currency, CurrencyOptions, CurrencyText, ExpenseItem } from '../expenses-models';
import { transformToGr } from 'src/app/pages/recipies/utils/recipy.utils';
import { DataMappingService } from 'src/app/services/data-mapping.service';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import * as _ from 'lodash';
import { UpdateUserAction } from 'src/app/store/actions/user.actions';
import { InputWithAutocompleteComponent } from 'src/app/shared/components/input-with-autocomplete/input-with-autocomplete.component';
import { ProductAutocompleteComponent } from 'src/app/shared/components/product-autocomplete/product-autocomplete.component';

@Component({
  selector: 'app-record-expenses',
  templateUrl: './record-expenses.component.html',
  styleUrls: ['./record-expenses.component.scss']
})
export class RecordExpensesComponent {
  productId: string = '';
  title: string = '';
  brand?: string = '';
  purchasePlace: string = '';
  purchaseDate: Date = new Date();
  amount: string = '';
  unit: MeasuringUnit = MeasuringUnit.gr;
  cost: string = '';
  currency: Currency = Currency.Hruvnya;

  isShowCurrencyPicker = false;
  isShowDatepicker = false;
  isShowUnitPicker = false;

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
    private store: Store<IAppState>,
    private datamapping: DataMappingService
  ) { }

  brandNames = [
    'Metro',
    'Veles',
    'ATB',
    'Silpo',
    'Arsen'
  ];

  onProductSelected(event: Product) {
    this.productId = event.id;
  }

  onDateChanged(event: any) {
    this.purchaseDate = new Date(event.detail.value);
  }

  get measuringUnitsOptions() {
    return MeasuringUnitOptions;
  }

  getMeasuringUnitText(unit: MeasuringUnit) {
    return MeasuringUnitText[unit];
  }

  get currencyOptions() {
    return CurrencyOptions;
  }

  getCurrencyText(curr: Currency) {
    return CurrencyText[curr]
  }

  isFormValid() {
    return this.productId.length &&
      this.title.length &&
      this.purchasePlace.length &&
      +this.amount > 0 &&
      +this.cost > 0;
  }

  clearForm() {
    this.productId = '';
    this.title = '';
    this.brand = '';
    this.amount = '';
    this.unit = MeasuringUnit.gr;
    this.cost = '';
    this.currency = Currency.Hruvnya;

    this.titleAutocomplete?.clearSearch();
    this.productAutocomplete?.clearSearch();
    this.brandAutocomplete?.clearSearch();
    
  }

  getcostPerHundredGrInHRN(
    productId: string,
    amount: number,
    unit: MeasuringUnit,
    cost: number
  ) {
    if (this.isValidProduct(productId)) {
      const totalGr = transformToGr(productId, amount, unit, this.datamapping.products$.getValue());
      const calculatedCost = (cost / totalGr) * 100;
      return calculatedCost;
    } else {
      const costPerOneSelectedUnit = cost / amount;
      return costPerOneSelectedUnit;
    }

  }

  isValidProduct(productId: string) {
    return productId !== 'other';
  }

  submit() {
    const costPerHundredGrInHRN = this.getcostPerHundredGrInHRN(
      this.productId,
      +this.amount,
      this.unit,
      +this.cost
    );
    const toAdd: ExpenseItem = {
      productId: this.productId,
      title: this.title,
      brand: this.brand,
      purchaseDate: this.purchaseDate,
      purchasePlace: this.purchasePlace,
      amount: +this.amount,
      unit: this.unit,
      cost: +this.cost,
      currency: this.currency,
      costPerHundredGrInHRN: costPerHundredGrInHRN
    }

    this.store.pipe(select(getCurrentUser), take(1)).subscribe(user => {
      if (user) {
        const clonedUser = _.cloneDeep(user);
        if (clonedUser.expenses) {
          clonedUser.expenses.push(toAdd)
        } else {
          clonedUser.expenses = [toAdd]
        }
        this.store.dispatch(new UpdateUserAction(clonedUser, 'expenses record saved'))
      }
    })
    this.clearForm()
  }

  @ViewChild('productAutocomplete') productAutocomplete: ProductAutocompleteComponent | undefined;
  @ViewChild('titleAutocomplete') titleAutocomplete: InputWithAutocompleteComponent | undefined;
  @ViewChild('brandAutocomplete') brandAutocomplete: InputWithAutocompleteComponent | undefined;
  @ViewChild('placeAutocomplete') placeAutocomplete: InputWithAutocompleteComponent | undefined;

}
