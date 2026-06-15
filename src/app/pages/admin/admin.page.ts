
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage {

  pages = [
    { name: 'Рецепти', path: `recipies` },
    { name: 'Продукти', path: 'products' },
    { name: 'Редагування продуктів', path: 'update-products' },
    { name: 'Коментарі до рецептів', path: 'recipies-comments' },
    { name: 'Додати продукт', path: 'add-product' },
    { name: 'Калькулятор щільності', path: 'density-calculator' },
  ];


}
