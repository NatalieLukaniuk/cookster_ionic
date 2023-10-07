import { MeasuringUnit, Product, ProductType } from 'src/app/models/recipies.models';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-product-autocomplete',
  templateUrl: './product-autocomplete.component.html',
  styleUrls: ['./product-autocomplete.component.scss'],
})
export class ProductAutocompleteComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products'].currentValue) {
      this.productsToDisplay = this.products.map(e => e);
      if (this.addNewProductAsOther) {
        const other = {
          name: 'Інше',
          id: 'other',
          density: 1,
          calories: 0,
          defaultUnit: MeasuringUnit.gr,
          type: ProductType.hardItem,
          sizeChangeCoef: 1
        }
        this.productsToDisplay.push(other)
      }
    }

  }

  @Input() products: Product[] = [];
  @Input() isAddNewProductEnabled = false;
  @Input() addNewProductAsOther = false;

  @Output() productSelected = new EventEmitter<Product>();
  @Output() onAddProduct = new EventEmitter<void>();

  keyword = 'name';

  selectedProduct: Product | null = null;

  initialValue: Product | null = null;

  presentingElement: Element | undefined | null;

  isSelected = false;

  productsToDisplay: Product[] = [];

  setSelected(productId: string) {
    const found = this.productsToDisplay.find(product => product.id === productId);
    if (found) {
      this.initialValue = found;
    }
  }

  selectEvent(item: Product) {
    this.isSelected = true;
    this.productSelected.emit(item);
  }

  onClearSearch() {
    this.isSelected = false;
    this.selectedProduct = null;
  }

  @ViewChild('autocomplete') autocomplete: any;
  clearSearch() {
    this.autocomplete.clear();
  }

  addNewProduct() {
    this.onAddProduct.emit();
  }

  onAddAsOther() {
    const other = {
      name: 'Інше',
      id: 'other',
      density: 1,
      calories: 0,
      defaultUnit: MeasuringUnit.gr,
      type: ProductType.hardItem,
      sizeChangeCoef: 1
    }
    this.isSelected = true;
    this.productSelected.emit(other)
  }
}
