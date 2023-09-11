import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { MeasuringUnit, MeasuringUnitOptions, MeasuringUnitText, Product, ProductType } from 'src/app/models/recipies.models';
import { IAppState } from 'src/app/store/reducers';
import { getAllProducts } from 'src/app/store/selectors/recipies.selectors';
import { Currency, CurrencyOptions, CurrencyText } from '../expenses-models';

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
  amount: number = 0;
  unit: MeasuringUnit = MeasuringUnit.gr;
  cost: number = 0;
  currency: Currency = Currency.Hruvnya;

  products: Product[] = [];
  products$: Observable<Product[]> = this.store.pipe(
    select(getAllProducts),
    map((res) => {
      if (res) {
        let products = res.map((i) => i);
        products.sort((a, b) => a.name.localeCompare(b.name));
        this.products = products;
        this.products.push({
          name: 'Інше',
          id: 'other',
          density: 1,
          calories: 0,
          defaultUnit: MeasuringUnit.gr,
          type: ProductType.hardItem,
          sizeChangeCoef: 1
        })
        return products;
      } else return [];
    })
  );

  constructor(
    private store: Store<IAppState>
  ) { }

  brandNames = [
    'Metro',
    'Veles',
    'ATB',
    'Silpo',
    'Arsen'
  ];

  onItemSelected(event: string) { console.log(event) }
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
}
