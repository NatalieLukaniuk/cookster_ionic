import { MeasuringUnit, Product, ProductType } from 'src/app/models/recipies.models';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-product-autocomplete',
  templateUrl: './product-autocomplete.component.html',
  styleUrls: ['./product-autocomplete.component.scss'],
})
export class ProductAutocompleteComponent {
  @Input() products: Product[] = [];
  @Input() isAddNewProductEnabled = false;
  @Input() addNewProductAsOther = false;

  @Output() productSelected = new EventEmitter<Product>();
  @Output() onAddProduct = new EventEmitter<void>();

  keyword = 'name';

  selectedProduct: Product | null = null;

  presentingElement: Element | undefined | null;

  isSelected = false;

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

  onAddAsOther(){
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
