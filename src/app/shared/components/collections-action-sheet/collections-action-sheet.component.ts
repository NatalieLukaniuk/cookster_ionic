import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ActionSheetButton } from '@ionic/angular';


import { Recipy } from 'src/app/models/recipies.models';
import { UserDataService } from 'src/app/services/user-data.service';


@Component({
  selector: 'app-collections-action-sheet',
  templateUrl: './collections-action-sheet.component.html',
  styleUrls: ['./collections-action-sheet.component.scss'],
})
export class CollectionsActionSheetComponent implements OnInit {
  userDataService = inject(UserDataService);

  $userCollections = this.userDataService.userRecipeCollections;

  ngOnInit(): void {
    this.actionSheetItems = this.getItems();
  }

  actionSheetItems: any[] = [];


  @Input() recipy!: Recipy;

  @Input() isIconPresentation = true;
  @Input() buttonTitle = '';
  @Input() buttonColor = 'primary'

  @Output() dismissed = new EventEmitter<void>()

  getItems(): ActionSheetButton[] {

    return this.$userCollections().map((collection) => ({
      text: collection.name,
      role: 'selected',
      data: {
        collection: collection.name
      },
      icon: this.getIsInCollection(collection.name) ? "checkmark-outline" : ""
    }));

  }

  onDismissed(event: any) {
    const selected = event.detail.data?.collection;
    if (selected) {
      this.onCollectionSelected(selected)
    }
    this.dismissed.emit()

  }

  getIsInCollection(collection: string) {
    return this.$userCollections()
      .find((coll) => coll.name == collection)
      ?.recipies?.find((recipy) => recipy == this.recipy.id);
  }

  onCollectionSelected(collection: string) {
    const updatedCollections = this.$userCollections().map((coll) => {
      if (coll.name === collection) {
        if (coll.recipies && coll.recipies.includes(this.recipy.id)) {
          coll.recipies = coll.recipies.filter((id) => id !== this.recipy.id);
        } else if (coll.recipies && !coll.recipies.includes(this.recipy.id)) {
          coll.recipies.push(this.recipy.id);
        } else {
          coll.recipies = [this.recipy.id];
        }
        return coll;
      } else return coll;
    });
    this.userDataService.updateCollections(updatedCollections)
  }
  updateItems() {
    this.actionSheetItems = this.getItems()
  }
}
