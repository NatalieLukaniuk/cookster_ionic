import { DishType, Ingredient, Product } from './../../../models/recipies.models';
import { Injectable } from '@angular/core';
import { Recipy } from 'src/app/models/recipies.models';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { DialogsService, ModalType } from 'src/app/services/dialogs.service';
import { DataMappingService } from 'src/app/services/data-mapping.service';
import { ExpencesService } from 'src/app/expenses/expences.service';
import { ExpenseItem } from 'src/app/expenses/expenses-models';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  constructor(private dialog: DialogsService, private datamapping: DataMappingService,
    private expencesService: ExpencesService) { }

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
      "розмір порції",
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
      row.push(recipy.ingrediends.map(ingr => this.getIngredientText(ingr)));
      row.push(recipy.isCheckedAndApproved);
      row.push(recipy.portionSize);
      row.push({ action: () => this.dialog.openModal(ModalType.ViewRecipy, { recipyId: recipy.id }), title: 'view' })
      row.push({ action: () => this.dialog.openModal(ModalType.EditRecipy, { recipyId: recipy.id }), title: 'edit' })
      data.push(row);
    }
    return data;
  }

  buildProductsTable(products: Product[], allExpenses: ExpenseItem[]): any[][] {
    let data = [];
    let firstRow = [
      'Назва',
      'id',
      'ккал/100гр',
      'density',
      'unit',
      'type',
      'grInOneItem',
      'найнижча ціна',
      'найвища ціна',
      'середня ціна',
      'клк.записів',
      'середня ціна за місяць',
      'клк.записів за місяць',
      'середня ціна за рік',
      'клк.записів за рік',
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
      row.push(this.getLowestPrice(allExpenses, product.id));
      row.push(this.getHighestPrice(allExpenses, product.id));
      row.push(this.getAveragePrice(allExpenses, product.id));
      row.push(this.getNumberOfRecords(allExpenses, product.id));
      row.push(this.getAveragePriceForLastMonth(allExpenses, product.id));
      row.push(this.getNumberOfRecordsLastMonth(allExpenses, product.id));
      row.push(this.getAveragePriceForHalfYear(allExpenses, product.id));
      row.push(this.getNumberOfRecordsHalfYear(allExpenses, product.id));
      data.push(row);
    }
    return data;
  }

  getLowestPrice(allExpenses: ExpenseItem[], productId: string): string {
    const filtered = this.expencesService.getExpensesByProduct(allExpenses, productId);
    return this.expencesService.getLowestPriceWithDetails(filtered)
  }

  getHighestPrice(allExpenses: ExpenseItem[], productId: string): string {
    const filtered = this.expencesService.getExpensesByProduct(allExpenses, productId);
    return this.expencesService.getHighestPriceWithDetails(filtered)
  }

  getAveragePrice(allExpenses: ExpenseItem[], productId: string): number {
    const filtered = this.expencesService.getExpensesByProduct(allExpenses, productId);
    return this.expencesService.getAveragePrice(filtered)
  }

  getAveragePriceForHalfYear(allExpenses: ExpenseItem[], productId: string): number {
    const filtered = this.expencesService.getExpensesByProduct(allExpenses, productId);
    return this.expencesService.getAveragePriceForHalfYear(filtered)
  }

  getAveragePriceForLastMonth(allExpenses: ExpenseItem[], productId: string): number {
    const filtered = this.expencesService.getExpensesByProduct(allExpenses, productId);
    return this.expencesService.getAveragePriceForLastMonth(filtered)
  }

  getNumberOfRecords(allExpenses: ExpenseItem[], productId: string): number{
    const filtered = this.expencesService.getExpensesByProduct(allExpenses, productId);
    return filtered.length
  }

  getNumberOfRecordsLastMonth(allExpenses: ExpenseItem[], productId: string): number{
    const filtered = this.expencesService.getExpensesByProduct(allExpenses, productId);
    const today = new Date();
    const startOfMonth = moment(today).clone().subtract(1, 'month')
    const filtered2 = filtered.filter(expense => moment(expense.purchaseDate).isSameOrAfter(startOfMonth));
    return filtered2.length
  }

  getNumberOfRecordsHalfYear(allExpenses: ExpenseItem[], productId: string): number{
    
    const filtered = this.expencesService.getExpensesByProduct(allExpenses, productId);
    const today = new Date();
    const halfYearAgo = moment(today).clone().subtract(6, 'month')
    const filtered2 = filtered.filter(expense => moment(expense.purchaseDate).isSameOrAfter(halfYearAgo));
    return filtered2.length
  }

  getIngredientText(ingredient: Ingredient): string {
    return this.datamapping.getIngredientText(ingredient);
  }
}
