import { InfoTabComponent } from './components/recipy-full-view/info-tab/info-tab.component';
import { IngredientsTabComponent } from './components/recipy-full-view/ingredients-tab/ingredients-tab.component';
import { ConvertToSelectedUnitPipe } from './utils/convert-to-selected-unit.pipe';
import { NormalizeDisplayedAmountPipe } from './utils/normalize-displayed-amount.pipe';
import { IngredientComponent } from './components/ingredient/ingredient.component';
import { RecipyFullViewComponent } from './components/recipy-full-view/recipy-full-view.component';
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
    RecipyFullViewComponent,
    IngredientComponent,
    NormalizeDisplayedAmountPipe,
    ConvertToSelectedUnitPipe,
    IngredientsTabComponent,
    InfoTabComponent
  ],
  providers: [NormalizeDisplayedAmountPipe, ConvertToSelectedUnitPipe]
})
export class RecipiesPageModule {}
