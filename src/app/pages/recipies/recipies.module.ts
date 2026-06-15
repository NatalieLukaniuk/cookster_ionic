import { FiltersModule } from './../../filters/filters.module';
import { EditRecipyComponent } from './pages/edit-recipy/edit-recipy.component';
import { SharedModule } from '../../shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RecipiesPageRoutingModule } from './recipies-routing.module';
import { FullRecipyPageComponent } from './pages/full-recipy-page/full-recipy-page.component';
import { RecipiesContainerPage } from './pages/all-recipies-page/recipies.page';
import { CommentsModule } from 'src/app/comments/comments.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RecipiesPageRoutingModule,
    SharedModule,
    FiltersModule,
    CommentsModule
  ],
  declarations: [
    RecipiesContainerPage,
    FullRecipyPageComponent,
    EditRecipyComponent
  ],
  
})
export class RecipiesPageModule {}
