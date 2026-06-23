import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserPageRoutingModule } from './user-routing.module';

import { UserPage } from './user.page';
import { ClearOldDataComponent } from './components/clear-old-data/clear-old-data.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GenericSettingsComponent } from './components/generic-settings/generic-settings.component';
import { EditFamilyComponent } from './components/edit-family/edit-family.component';
import { ManageCollectionsComponent } from './components/manage-collections/manage-collections.component';
import { HiddenRecipiesComponent } from './components/hidden-recipies/hidden-recipies.component';
import { CommentsModule } from 'src/app/comments/comments.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserPageRoutingModule,
    SharedModule,
    CommentsModule
  ],
  declarations: [UserPage, ClearOldDataComponent, GenericSettingsComponent, EditFamilyComponent, ManageCollectionsComponent, HiddenRecipiesComponent]
})
export class UserPageModule { }
