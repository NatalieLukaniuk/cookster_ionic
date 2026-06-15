import { Product } from 'src/app/models/recipies.models';
import { Component, computed, inject } from '@angular/core';
import { TableService } from '../../services/table.service';
import { ProductsService } from 'src/app/services/products.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  productsService = inject(ProductsService);
  uiService = inject(UiService);
  productsTableData = computed(() => this.tableService.buildProductsTable(this.$products()));

  $products = this.productsService.getProducts;

  constructor(
    private tableService: TableService,
  ) {

   }

  runUpdate() {
    this.recursiveUpdate(0, this.$products());
  }

  recursiveUpdate(i: number, products: Product[]) {// TODO needs rework
    if (i < products.length) {
      setTimeout(() => {
        if (!products[i].sizeChangeCoef) {
          let update = this.updateScript(products[i]);
          console.log(update);
          this.productsService.updateProduct(update).subscribe(() => this.uiService.showSuccessMessage(`${update.name} has been updated`));
        }
        console.log(i + ' of ' + products.length)
        i++;
        this.recursiveUpdate(i, products);
      }, 1000);
    }
  }

  updateScript(product: Product): Product {
    let _product = {...product};
    _product.sizeChangeCoef = 1;
    return _product;
  }
}
