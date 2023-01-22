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

@Component({
  selector: 'app-add-to-list-modal',
  templateUrl: './add-to-list-modal.component.html',
  styleUrls: ['./add-to-list-modal.component.scss'],
})
export class AddToListModalComponent implements OnInit {
  ingredient!: SLItem;
  lists!: ShoppingList[];
  allRecipies!: Recipy[];

  selectedList = '';

  amountToAdd = '';

  getUnitText = getUnitText;
  moment = moment;

  isAddNewList = false;
  newList = '';

  ngOnInit() {
    let converted = convertAmountToSelectedUnit(
      this.ingredient.total,
      this.ingredient.unit,
      this.ingredient.id,
      this.datamapping.products$.value
    );
    let normalized = NormalizeDisplayedAmount(converted, this.ingredient.unit);
    this.amountToAdd = normalized + ' ' + getUnitText(this.ingredient.unit);
  }

  constructor(
    private modalCtrl: ModalController,
    private datamapping: DataMappingService
  ) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    this.lists.forEach((list) => {
      if (list.name === this.selectedList) {
        list.items.push({
          title: this.ingredient.name,
          amount: this.amountToAdd,
          editMode: false,
          completed: false,
        });
      }
    });

    return this.modalCtrl.dismiss(this.lists, 'confirm');
  }

  listChange(event: any) {
    this.selectedList = event.detail.value;
  }

  get isValid(): boolean {
    return !!this.selectedList.length;
  }

  getrecipyName(id: string) {
    if (this.allRecipies) {
      return getRecipyNameById(this.allRecipies, id);
    } else return '';
  }

  addList() {
    this.lists.push({
      name: this.newList,
      isExpanded: false,
      items: [],
    });
    this.isAddNewList = false;
  }
}
