import { SwipeLeftNoConfirmationDirective } from './directives/swipe-left-no-confirmation.directive';
import { InputDialogComponent } from './components/dialogs/input-dialog/input-dialog.component';
import { SelectOptionDialogComponent } from './components/dialogs/select-option-dialog/select-option-dialog.component';

import { InfoTabComponent } from './components/recipy-full-view/info-tab/info-tab.component';
import { ImageComponent } from './components/image/image.component';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';
import { NormalizeTimePipe } from './pipes/normalize-time.pipe';
import { RecipyFullViewComponent } from './components/recipy-full-view/recipy-full-view.component';
import { IngredientsTabComponent } from './components/recipy-full-view/ingredients-tab/ingredients-tab.component';
import { IngredientComponent } from './components/ingredient/ingredient.component';
import { FormsModule } from '@angular/forms';
import { NormalizeDisplayedAmountPipe } from './pipes/normalize-displayed-amount.pipe';
import { ConvertToSelectedUnitPipe } from './pipes/convert-to-selected-unit.pipe';
import { SwipeLeftDirective } from './directives/swipe-left.directive';

@NgModule({
  declarations: [
    HeaderComponent,
    LoadingOverlayComponent,
    ImageComponent,
    NormalizeTimePipe,
    RecipyFullViewComponent,
    InfoTabComponent,
    IngredientsTabComponent,
    IngredientComponent,
    NormalizeDisplayedAmountPipe,
    ConvertToSelectedUnitPipe,
    SelectOptionDialogComponent,
    InputDialogComponent,
    SwipeLeftDirective,
    SwipeLeftNoConfirmationDirective
  ],
  imports: [CommonModule, IonicModule, FormsModule],
  exports: [
    HeaderComponent,
    LoadingOverlayComponent,
    ImageComponent,
    NormalizeTimePipe,
    RecipyFullViewComponent,
    SelectOptionDialogComponent,
    InputDialogComponent,
    SwipeLeftDirective,
    NormalizeDisplayedAmountPipe,
    ConvertToSelectedUnitPipe,
    SwipeLeftNoConfirmationDirective
  ],
  providers: [NormalizeDisplayedAmountPipe, ConvertToSelectedUnitPipe],
})
export class SharedModule {}
