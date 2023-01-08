import { RecipyShortViewComponent } from './components/recipy-short-view/recipy-short-view.component';
import { SharedModule } from '../../shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipiesContainer } from './recipies.page';

import { RecipiesPageRoutingModule } from './recipies-routing.module';
import { FullRecipyPageComponent } from './pages/full-recipy-page/full-recipy-page.component';

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
  ],
})
export class RecipiesPageModule {}
