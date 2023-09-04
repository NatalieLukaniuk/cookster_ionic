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
  Input,
} from '@angular/core';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { Role } from 'src/app/models/auth.models';

@Component({
  selector: 'app-add-ingredient',
  templateUrl: './add-ingredient.component.html',
  styleUrls: ['./add-ingredient.component.scss'],
})
export class AddIngredientComponent implements OnInit, OnDestroy {
  @Output() addNewIngredient = new EventEmitter<Ingredient>();
  @Input() isSplitIntoGroups: boolean = false;
  @Input() groups: Set<string> | undefined;

  _groups: string[] = ['Основна страва'];

  data: Product[] = [];

  destroyed$ = new Subject<void>();

  selectedProduct: Product | null = null;
  quantity: string = '';
  unit: MeasuringUnit = MeasuringUnit.gr;
  selectedgroup: string = this._groups[0];

  isAdmin$: Observable<boolean> = this.store.pipe(select(getCurrentUser), map(user => (!!user && user?.role === Role.Admin)));

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

  ngOnInit() {
    if (this.groups?.size) {
      this._groups = Array.from(this.groups);
      this.selectedgroup = this._groups[0];
    }
  }

  selectEvent(item: Product) {
    this.selectedProduct = item;
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
      if (this.isSplitIntoGroups) {
        ingr.group = this.selectedgroup;
      }
      this.addNewIngredient.emit(ingr);
      this.clear();
    }
  }

  get isAddDisabled() {
    return (
      !this.selectedProduct ||
      (!+this.quantity && this.unit !== MeasuringUnit.none)
    );
  }

  clear() {
    this.selectedProduct = null;
    this.quantity = '';
    this.unit = MeasuringUnit.gr;
    this.autocomplete.clearSearch();
    this.autocomplete.autocomplete.close();
  }

  onGroupName(event: string) {
    this._groups.push(event);
    this.selectedgroup = this._groups[this._groups.length - 1];
  }
}
