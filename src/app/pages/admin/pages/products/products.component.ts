import { Product } from 'src/app/models/recipies.models';
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, take, tap } from 'rxjs';
import { IAppState } from 'src/app/store/reducers';
import { getAllProducts } from 'src/app/store/selectors/recipies.selectors';
import { TableService } from '../../services/table.service';
import { UpdateProductAction } from 'src/app/store/actions/recipies.actions';
import * as _ from 'lodash';
import { ExpencesService } from 'src/app/expenses/expences.service';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss'],
    standalone: false
})
export class ProductsComponent implements OnInit {
  productsTableData: string[][] = [];

  products$ = combineLatest([
    this.store.pipe(select(getAllProducts)),
    this.expencesService.getExpenses()
  ]).pipe(
    tap(
      (res) => {
        if (res[0].length && res[1].length) {
          this.productsTableData = this.tableService.buildProductsTable(res[0], res[1]);
        }
      }
    )
  )

  constructor(
    private store: Store<IAppState>,
    private tableService: TableService,
    private expencesService: ExpencesService
  ) { }

  ngOnInit() { }

  runUpdate() {
    this.products$.pipe(take(1)).subscribe((res) => {
      this.recursiveUpdate(0, res[0]);
    });
  }

  recursiveUpdate(i: number, products: Product[]) {
    if (i < products.length) {
      setTimeout(() => {
        if (!products[i].sizeChangeCoef) {
          let update = this.updateScript(products[i]);
          console.log(update);
          this.store.dispatch(new UpdateProductAction(update));
        }
        console.log(i + ' of ' + products.length)
        i++;
        this.recursiveUpdate(i, products);
      }, 1000);
    }
  }

  updateScript(product: Product): Product {
    let _product = _.cloneDeep(product);
    _product.sizeChangeCoef = 1;
    return _product;
  }
}
