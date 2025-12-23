import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActionSheetButton } from '@ionic/angular';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { User } from 'src/app/models/auth.models';
import { Recipy } from 'src/app/models/recipies.models';
import { UpdateUserAction } from 'src/app/store/actions/user.actions';
import { IAppState } from 'src/app/store/reducers';

@Component({
  selector: 'app-collections-action-sheet',
  templateUrl: './collections-action-sheet.component.html',
  styleUrls: ['./collections-action-sheet.component.scss'],
})
export class CollectionsActionSheetComponent implements OnInit {
  ngOnInit(): void {
    this.actionSheetItems = this.getItems();
  }

  actionSheetItems: any[] = [];

  @Input()
  currentUser!: User | null;

  @Input() recipy!: Recipy;

  @Input() isIconPresentation = true;
  @Input() buttonTitle = '';
  @Input() buttonColor = 'primary'

  @Output() dismissed = new EventEmitter<void>()

constructor(private store: Store<IAppState>,){}

  getItems(): ActionSheetButton[] {
    if (this.currentUser?.collections) {
      return this.currentUser.collections.map((collection) => ({
        text: collection.name,
        role: 'selected',
        data: {
          collection: collection.name
        },
        icon: this.getIsInCollection(collection.name) ? "checkmark-outline" : "" 
      }));
    } else return [];
  }

  onDismissed(event: any) {    
    const selected = event.detail.data?.collection;
    if(selected){
      this.onCollectionSelected(selected)
    }
    this.dismissed.emit()
    
  }

  getIsInCollection(collection: string) {
    if (this.currentUser?.collections) {
      return this.currentUser.collections
        .find((coll) => coll.name == collection)
        ?.recipies?.find((recipy) => recipy == this.recipy.id);
    } else return false;
  }

  onCollectionSelected(collection: string) {
    if (this.currentUser) {
      let updated = _.cloneDeep(this.currentUser);
      updated.collections = updated.collections!.map((coll) => {
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
      this.store.dispatch(
        new UpdateUserAction(
          updated,
          `${this.recipy.id} додано до колекції ${collection}`
        )
      );
    }
    
  }
  updateItems(){
    this.actionSheetItems = this.getItems()
  }
}
