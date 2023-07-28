import { DishType, Product } from './../../../models/recipies.models';
import { Injectable } from '@angular/core';
import { Recipy } from 'src/app/models/recipies.models';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  constructor(private router: Router) {}

  buildTable(object: Object[]): string[][] {
    let data = [];
    let firstRow = Object.keys(object[0]);
    data.push(firstRow);
    for (let item of object) {
      let row = Object.values(item);
      data.push(row);
    }
    return data;
  }

  buildRecipyTable(recipies: Recipy[]): any[][] {
    let data = [];
    let firstRow = [
      'Назва',
      'id',
      'ккал/100гр',
      'автор',
      'створений',
      'розділений на групи',
      "тип",
      "інгридієнти",
      "перевірений",
      "Перегляд",
      "Редагування",

    ];
    data.push(firstRow);
    for (let recipy of recipies) {
      let row = [];
      row.push(recipy.name);
      row.push(recipy.id);
      let calorificValue = recipy.calorificValue
        ? Math.round(recipy.calorificValue)
        : '-';
      row.push(calorificValue);
      row.push(recipy.author);
      row.push(moment(recipy.createdOn).format('MMM Do YYYY'));
      row.push(recipy.isSplitIntoGroups);
      row.push(recipy.type.map((tag: DishType) => DishType[tag]));
      row.push(recipy.ingrediends.map(ingr => ingr.ingredient));
      row.push(recipy.isCheckedAndApproved);
      row.push({action: () => this.router.navigate(['tabs', 'recipies', 'recipy', recipy.id]), title: 'view'})
      row.push({action: () => this.router.navigate(['tabs', 'recipies', 'edit-recipy', recipy.id]), title: 'edit'})
      data.push(row);
    }
    return data;
  }

  buildProductsTable(products: Product[]): any[][] {
    let data = [];
    let firstRow = [
      'Назва',
      'id',
      'ккал/100гр',
      'density',
      'unit',
      'type',
      'grInOneItem',
    ];
    data.push(firstRow);
    for (let product of products) {
      let row = [];
      row.push(product.name);
      row.push(product.id);
      row.push(product.calories);
      row.push(product.density);
      row.push(product.defaultUnit);
      row.push(product.type);
      row.push(product.grInOneItem);
      data.push(row);
    }
    return data;
  }
}
