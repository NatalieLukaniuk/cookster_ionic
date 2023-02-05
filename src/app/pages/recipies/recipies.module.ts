import { EditRecipyComponent } from './pages/edit-recipy/edit-recipy.component';
import { RecipyShortViewComponent } from './components/recipy-short-view/recipy-short-view.component';
import { SharedModule } from '../../shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RecipiesPageRoutingModule } from './recipies-routing.module';
import { FullRecipyPageComponent } from './pages/full-recipy-page/full-recipy-page.component';
import { RecipiesContainer } from './pages/all-recipies-page/recipies.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RecipiesPageRoutingModule,
    SharedModule,
  ],
  declarations: [
    RecipiesContainer,
    RecipyShortViewComponent,
    FullRecipyPageComponent,
    EditRecipyComponent
  ],
  
})
export class RecipiesPageModule {}
