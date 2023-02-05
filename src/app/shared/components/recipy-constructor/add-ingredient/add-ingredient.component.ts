import { getAllProducts } from '../../../../store/selectors/recipies.selectors';
import {
  Ingredient,
  MeasuringUnitOptionsGranular,
  MeasuringUnitOptionsHardHomogeneous,
  MeasuringUnitOptionsHardItems,
  MeasuringUnitOptionsHerbs,
  MeasuringUnitOptionsSpice,
} from '../../../../models/recipies.models';
import {
  Product,
  MeasuringUnit,
  MeasuringUnitText,
  ProductType,
  MeasuringUnitOptionsFluid,
} from 'src/app/models/recipies.models';
import { DataMappingService } from 'src/app/services/data-mapping.service';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-add-ingredient',
  templateUrl: './add-ingredient.component.html',
  styleUrls: ['./add-ingredient.component.scss'],
})
export class AddIngredientComponent implements OnInit, OnDestroy {
  @Output() addNewIngredient = new EventEmitter<Ingredient>();

  data: Product[] = [];
  keyword = 'name';

  destroyed$ = new Subject<void>();

  selectedProduct: Product | null = null;
  quantity: string = '';
  unit: MeasuringUnit = MeasuringUnit.gr;

  @ViewChild('autocomplete') autocomplete: any;

  constructor(private store: Store, private dataMapping: DataMappingService) {
    this.store
      .pipe(select(getAllProducts), takeUntil(this.destroyed$))
      .subscribe((res) => {
        if (res) {
          this.data = res;
        }
      });
  }
  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  ngOnInit() {}

  selectEvent(item: Product) {
    this.selectedProduct = item;
  }

  onClearSearch() {
    this.selectedProduct = null;
  }

  get measuringUnitsOptions() {
    if (!this.selectedProduct) {
      return [];
    } else {
      switch (this.selectedProduct.type) {
        case ProductType.fluid:
          return MeasuringUnitOptionsFluid;
        case ProductType.granular:
          return MeasuringUnitOptionsGranular;
        case ProductType.hardHomogenious:
          return MeasuringUnitOptionsHardHomogeneous;
        case ProductType.hardItem:
          return MeasuringUnitOptionsHardItems;
        case ProductType.herb:
          return MeasuringUnitOptionsHerbs;
        case ProductType.spice:
          return MeasuringUnitOptionsSpice;
      }
    }
  }

  getMeasuringUnitText(unit: MeasuringUnit) {
    return MeasuringUnitText[unit];
  }

  addIngredient() {
    if (this.selectedProduct) {
      let ingr: Ingredient = {
        product: this.selectedProduct.id,
        amount: this.dataMapping.transformToGr(
          this.selectedProduct.id,
          +this.quantity,
          this.unit
        ),
        defaultUnit: this.unit,
        ingredient: this.selectedProduct.name,
      };
      this.addNewIngredient.emit(ingr);
      this.clear();
    }
  }

  get isAddDisabled() {
    return !this.selectedProduct || !+this.quantity;
  }

  clear() {
    this.selectedProduct = null;
    this.quantity = '';
    this.unit = MeasuringUnit.gr;
    this.autocomplete.clear();
    this.autocomplete.close();
  }
}
