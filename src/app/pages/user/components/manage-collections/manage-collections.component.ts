import { CreateRecipyCollection } from './../../../../store/actions/user.actions';
import { Component, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { IAppState } from 'src/app/store/reducers';
import { getUserCollections } from 'src/app/store/selectors/user.selectors';
import { InputDialogComponent } from 'src/app/shared/components/dialogs/input-dialog/input-dialog.component';

@Component({
  selector: 'app-manage-collections',
  templateUrl: './manage-collections.component.html',
  styleUrls: ['./manage-collections.component.scss']
})
export class ManageCollectionsComponent {

  collections$ = this.store.pipe(select(getUserCollections));

  @ViewChild(InputDialogComponent) newCollectionDialog: InputDialogComponent | undefined;

  constructor(private store: Store<IAppState>) { }

  addCollection(collectionName: string) {
    this.store.dispatch(new CreateRecipyCollection(collectionName));
    if (this.newCollectionDialog) {
      this.newCollectionDialog.clearInput();
    }
  }


}
