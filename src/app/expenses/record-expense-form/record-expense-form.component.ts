import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subject, Observable, map, takeUntil } from 'rxjs';
import { MeasuringUnit, Product, MeasuringUnitOptions, MeasuringUnitText } from 'src/app/models/recipies.models';
import { transformToGr } from 'src/app/pages/recipies/utils/recipy.utils';
import { DataMappingService } from 'src/app/services/data-mapping.service';
import { InputWithAutocompleteComponent } from 'src/app/shared/components/input-with-autocomplete/input-with-autocomplete.component';
import { ProductAutocompleteComponent } from 'src/app/shared/components/product-autocomplete/product-autocomplete.component';
import { AddExpenseAction } from 'src/app/store/actions/expenses.actions';
import { IAppState } from 'src/app/store/reducers';
import { getExpenses } from 'src/app/store/selectors/expenses.selectors';
import { getAllProducts } from 'src/app/store/selectors/recipies.selectors';
import { Currency, ExpenseItem, CurrencyOptions, CurrencyText } from '../expenses-models';

@Component({
    selector: 'app-record-expense-form',
    templateUrl: './record-expense-form.component.html',
    styleUrls: ['./record-expense-form.component.scss'],
    standalone: false
})
export class RecordExpenseFormComponent   implements OnInit, OnDestroy {
@Input() isModal = false;
@Input() presetProduct: Product | null = null;
@Output() recordAdded = new EventEmitter<void>()

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
  showAddProduct = false;
  isShowCostCalculator = false;

  originalCost = '';
  discount = '';

  destroy$ = new Subject<void>();

  expenses: ExpenseItem[] = []

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
    private datamapping: DataMappingService,
  ) { }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {

    this.store.pipe(select(getExpenses)).pipe(takeUntil(this.destroy$)).subscribe(expenses => {
      if (expenses?.length) {
        this.expenses = expenses
        const allBrands = expenses.filter(expense => !!expense?.brand).map(expense => expense.brand)
        this.brandAutocompleteOptions = this.getUnique(allBrands as string[]);
        this.titleAutocompleteOptions = this.getUnique(expenses.map(expense => expense?.title));
        this.placeAutocomleteOptions = this.getUnique(expenses.map(expense => expense?.purchasePlace));
      }
    })

    if(this.isModal){
      setTimeout(() => {
        this.onExpenseNameAdded(this.title)
      }, 200)
    }

    if(this.presetProduct){
      setTimeout(() => {
        this.onProductSelected(this.presetProduct!)
      }, 200)
    }
  }

  titleAutocompleteOptions: string[] = [];
  brandAutocompleteOptions: string[] = [];
  placeAutocomleteOptions: string[] = [];

  getUnique(array: string[]): string[] {
    const unique = new Set();
    array.forEach(item => unique.add(item));
    return Array.from(unique.values()) as string[];
  }

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
    this.cost = '';
    this.currency = Currency.Hruvnya;
    this.originalCost = '';
    this.discount = '';

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

    this.store.dispatch(new AddExpenseAction(toAdd))
    this.clearForm()
    this.recordAdded.emit()
  }

  @ViewChild('productAutocomplete') productAutocomplete: ProductAutocompleteComponent | undefined;
  @ViewChild('titleAutocomplete') titleAutocomplete: InputWithAutocompleteComponent | undefined;
  @ViewChild('brandAutocomplete') brandAutocomplete: InputWithAutocompleteComponent | undefined;
  @ViewChild('placeAutocomplete') placeAutocomplete: InputWithAutocompleteComponent | undefined;

  calculateCost() {
    this.cost = (Math.round((+this.originalCost - +this.discount) * 100) / 100).toString();
  }

  onExpenseNameAdded(event: string) {
    this.title = event;
    const found = this.expenses.find((expenseItem: ExpenseItem) => expenseItem.title === event);

    if (found) {
        const productId = found.productId;
        this.productId = productId;
      this.productAutocomplete?.setSelected(productId);
        this.brand = found.brand;
        if (this.brand) {
          this.brandAutocomplete?.setSelected(this.brand);
        }
        this.unit = found.unit
    }
  }

}
