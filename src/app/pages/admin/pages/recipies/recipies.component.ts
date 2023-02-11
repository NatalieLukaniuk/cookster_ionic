import { Recipy } from './../../../../models/recipies.models';
import { TableService } from './../../services/table.service';
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map, Observable, take, tap } from 'rxjs';
import { IAppState } from 'src/app/store/reducers';
import {
  getAllRecipies,
  getAllProducts,
} from 'src/app/store/selectors/recipies.selectors';
import { UpdateRecipyAction } from 'src/app/store/actions/recipies.actions';

@Component({
  selector: 'app-recipies',
  templateUrl: './recipies.component.html',
  styleUrls: ['./recipies.component.scss'],
})
export class RecipiesComponent implements OnInit {
  Object = Object;
  recipiesTableData: string[][] = [];
  recipies$ = this.store.pipe(
    select(getAllRecipies),
    tap((res) => {
      if (res.length) {
        this.recipiesTableData = this.tableService.buildRecipyTable(res);
      }
    })
  );
  products$ = this.store.pipe(select(getAllProducts));
  constructor(
    private store: Store<IAppState>,
    private tableService: TableService
  ) {}

  ngOnInit() {}

  runUpdate() {
    this.recipies$.pipe(take(1)).subscribe((res) => {
      this.recursiveUpdate(0, res);
    });
  }

  recursiveUpdate(i: number, recipies: Recipy[]) {
    if (i < recipies.length - 1) {
      setTimeout(() => {
        let update = this.updateScript(recipies[i]);
        console.log(update);
        this.store.dispatch(new UpdateRecipyAction(update));
        i++;
        this.recursiveUpdate(i, recipies);
      }, 1000);
    }
  }

  updateScript(recipy: Recipy): Recipy {
    return recipy;
  }
}
