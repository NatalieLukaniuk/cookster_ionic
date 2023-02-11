import { getAllProducts } from './../../store/selectors/recipies.selectors';
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/reducers';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  recipies$ = this.store.pipe(select(getAllRecipies));
  products$ = this.store.pipe(select(getAllProducts));

  pages = [
    { name: 'Рецепти', path: `recipies` },
    { name: 'Продукти', path: 'products' },
    { name: 'Редагування продуктів', path: 'update-products' },
    { name: 'Коментарі до рецептів', path: 'recipies-comments' },
  ];

  constructor(private store: Store<IAppState>) { }

  ngOnInit() {
    
  }

}
