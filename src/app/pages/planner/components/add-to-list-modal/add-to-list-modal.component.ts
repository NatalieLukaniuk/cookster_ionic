import { DataMappingService } from 'src/app/services/data-mapping.service';
import { ShoppingList } from './../../../../models/planner.models';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SLItem } from 'src/app/models/planner.models';
import { Recipy } from 'src/app/models/recipies.models';
import {
  convertAmountToSelectedUnit,
  getRecipyNameById,
  getUnitText,
  NormalizeDisplayedAmount,
} from 'src/app/pages/recipies/utils/recipy.utils';
import * as moment from 'moment';
import { DialogsService } from 'src/app/services/dialogs.service';

@Component({
  selector: 'app-add-to-list-modal',
  templateUrl: './add-to-list-modal.component.html',
  styleUrls: ['./add-to-list-modal.component.scss'],
})
export class AddToListModalComponent implements OnInit {
  ingredient!: SLItem;
  lists!: ShoppingList[];
  allRecipies!: Recipy[];
  isPlannedIngredient!: boolean;

  selectedList = '';

  amountToAdd = '';

  getUnitText = getUnitText;
  moment = moment;

  isAddNewList = false;
  newList = '';

  newItemName = '';

  ngOnInit() {
    if (this.isPlannedIngredient) {
      let converted = convertAmountToSelectedUnit(
        this.ingredient.total,
        this.ingredient.unit,
        this.ingredient.id,
        this.datamapping.products$.value
      );
      let normalized = NormalizeDisplayedAmount(
        converted,
        this.ingredient.unit
      );
      this.amountToAdd = normalized + ' ' + getUnitText(this.ingredient.unit);
    }
  }

  constructor(
    private modalCtrl: ModalController,
    private datamapping: DataMappingService,
    private dialog: DialogsService
  ) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    if (this.isPlannedIngredient) {
      this.lists.forEach((list) => {
        if (list.name === this.selectedList) {
          if(!list.items){
            list.items = []
          }
          list.items.push({
            title: this.ingredient.name,
            amount: this.amountToAdd,
            editMode: false,
            completed: false,
          });
        }
      });
    } else {
      this.lists.forEach((list) => {
        if (list.name === this.selectedList) {
          if(!list.items){
            list.items = []
          }
          list.items.push({
            title: this.newItemName,
            amount: this.amountToAdd,
            editMode: false,
            completed: false,
          });
        }
      });
    }

    return this.modalCtrl.dismiss(this.lists, 'confirm');
  }

  listChange(event: any) {
    this.selectedList = event.detail.value;
  }

  get isValid(): boolean {
    if (this.isPlannedIngredient) {
      return !!this.selectedList.length;
    } else {
      return (
        !!this.selectedList.length &&
        !!this.amountToAdd.length &&
        !!this.newItemName.length
      );
    }
  }

  get confirmButton() {
    if (this.isValid) {
      return 'Додати';
    } else if (this.isPlannedIngredient) {
      return 'Виберіть список';
    } else {
      if (!this.newItemName.length) {
        return 'Вкажіть назву продукту';
      } else if (!this.selectedList.length) {
        return 'Виберіть список';
      } else {
        return 'Вкажіть кількість';
      }
    }
  }

  getrecipyName(id: string) {
    if (this.allRecipies) {
      return getRecipyNameById(this.allRecipies, id);
    } else return '';
  }

  addList() {
    if(this.lists){
      this.lists.push({
      name: this.newList,
      isExpanded: false,
      items: [],
    });
    } else {
      this.lists = [{
        name: this.newList,
        isExpanded: false,
        items: [],
      }]
    }
    
    this.isAddNewList = false;
  }

  onDeleteList(list: ShoppingList) {
    this.dialog
      .openConfirmationDialog(
        `Видалити список ${list.name}?`,
        `${list.items.length} інгридієнтів буде з нього вилучено`
      )
      .then((res) => {
        if (res.role === 'confirm') {
          this.lists = this.lists.filter((item) => item.name !== list.name);
        }
      });
  }
}
