import { Product } from 'src/app/models/recipies.models';
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

  @Output() productSelected = new EventEmitter<Product>();

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
}
