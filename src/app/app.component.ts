import {
  getAllProducts,
  getAllRecipies,
} from './store/selectors/recipies.selectors';
import { Store, select } from '@ngrx/store';
import { RecipiesApiService } from './services/recipies-api.service';
import { Component, OnInit } from '@angular/core';
import * as RecipiesActions from './store/actions/recipies.actions';
import * as UiActions from './store/actions/ui.actions';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  firebaseConfig = {
    apiKey: 'AIzaSyAYe2tCdCuYoEPi0grZ1PkHTHgScw19LpA',
    authDomain: 'cookster-12ac8.firebaseapp.com',
    databaseURL: 'https://cookster-12ac8-default-rtdb.firebaseio.com/',
    projectId: 'cookster-12ac8',
    storageBucket: 'gs://cookster-12ac8.appspot.com/',
    messagingSenderId: '755799855022',
    appId: '1:755799855022:web:506cb5221a72eff4cf023f',
  };

  constructor(private store: Store) {}
  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.store.dispatch(new UiActions.SetIsLoadingAction());
    this.store.dispatch(new RecipiesActions.GetRecipiesAction());
    this.store.dispatch(new RecipiesActions.GetProductsAction());
    
    combineLatest([
      this.store.pipe(select(getAllProducts)),
      this.store.pipe(select(getAllRecipies)),
    ]).subscribe((res) => {
      let [products, recipies] = res;
      if (products.length && recipies.length) {
        this.store.dispatch(new UiActions.SetIsLoadingFalseAction());
      }
    });
  }
}
