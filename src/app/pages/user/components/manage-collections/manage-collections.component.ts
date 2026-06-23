import { Component, inject, ViewChild } from '@angular/core';
import { InputDialogComponent } from 'src/app/shared/components/dialogs/input-dialog/input-dialog.component';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-manage-collections',
  templateUrl: './manage-collections.component.html',
  styleUrls: ['./manage-collections.component.scss']
})
export class ManageCollectionsComponent {
  userDataService = inject(UserDataService);

  $collections = this.userDataService.userRecipeCollections;

  @ViewChild(InputDialogComponent) newCollectionDialog: InputDialogComponent | undefined;

  addCollection(collectionName: string) {
    this.userDataService.createCollection(collectionName)
    
    if (this.newCollectionDialog) {
      this.newCollectionDialog.clearInput();
    }
  }


}
