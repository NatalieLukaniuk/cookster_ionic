import { Product } from 'src/app/models/recipies.models';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-product-autocomplete',
  templateUrl: './product-autocomplete.component.html',
  styleUrls: ['./product-autocomplete.component.scss'],
})
export class ProductAutocompleteComponent implements OnInit {
  @Input() products: Product[] = [];

  @Output() productSelected = new EventEmitter<Product>();

  keyword = 'name';

  selectedProduct: Product | null = null;

  constructor() {}

  ngOnInit() {}

  selectEvent(item: Product) {
    this.productSelected.emit(item);
  }

  onClearSearch() {
    this.selectedProduct = null;
  }

  @ViewChild('autocomplete') autocomplete: any;
  clearSearch() {
    this.autocomplete.clear();
  }
}
