import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { tap } from 'rxjs';
import { IAppState } from 'src/app/store/reducers';
import { getAllProducts } from 'src/app/store/selectors/recipies.selectors';
import { TableService } from '../../services/table.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  productsTableData: string[][] = [];
  products$ = this.store.pipe(
    select(getAllProducts),
    tap((res) => {
      if (res.length) {
        this.productsTableData = this.tableService.buildProductsTable(res);
      }
    })
  );
  constructor(
    private store: Store<IAppState>,
    private tableService: TableService
  ) {}

  ngOnInit() {}
}
