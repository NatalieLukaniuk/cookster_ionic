import { LongPressDirective } from './directives/long-press.directive';
import { ProductAutocompleteComponent } from './components/product-autocomplete/product-autocomplete.component';
import { AddGroupModalComponent } from './components/recipy-constructor/add-group-modal/add-group-modal.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NormalizeDisplayedAmountPipe } from './pipes/normalize-displayed-amount.pipe';
import { ConvertToSelectedUnitPipe } from './pipes/convert-to-selected-unit.pipe';
import { SwipeLeftDirective } from './directives/swipe-left.directive';
import { RecipyConstructorComponent } from './components/recipy-constructor/recipy-constructor.component';
import { AddIngredientComponent } from './components/recipy-constructor/add-ingredient/add-ingredient.component';
import { AddStepComponent } from './components/recipy-constructor/add-step/add-step.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { PrepsComponent } from './components/recipy-constructor/preps/preps.component';
import { ControllerInputDialogComponent } from './components/dialogs/controller-input-dialog/controller-input-dialog.component';
import { RecipyModalComponent } from './components/dialogs/recipy-modal/recipy-modal.component';
import { RecipyShortViewComponent } from './components/recipy-short-view/recipy-short-view.component';
import { AddReminderModalComponent } from './components/dialogs/add-reminder-modal/add-reminder-modal.component';
import { ControllerListSelectDialogComponent } from './components/dialogs/controller-list-select-dialog/controller-list-select-dialog.component';
import { AddProductFormComponent } from './components/add-product-form/add-product-form.component';
import { InputWithAutocompleteComponent } from './components/input-with-autocomplete/input-with-autocomplete.component';
import { CostOfRecipyComponent } from './components/cost-of-recipy/cost-of-recipy.component';
import { LastPreparedDatePipe } from './pipes/last-prepared-date.pipe';

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
    SwipeLeftNoConfirmationDirective,
    RecipyConstructorComponent,
    AddIngredientComponent,
    AddStepComponent,
    FileUploadComponent,
    AddGroupModalComponent,
    ProductAutocompleteComponent,
    LongPressDirective,
    PrepsComponent,
    ControllerInputDialogComponent,
    RecipyModalComponent,
    RecipyShortViewComponent,
    AddReminderModalComponent,
    ControllerListSelectDialogComponent,
    AddProductFormComponent,
    InputWithAutocompleteComponent,
    CostOfRecipyComponent,
    LastPreparedDatePipe
  ],
  imports: [CommonModule, IonicModule, FormsModule, AutocompleteLibModule, ReactiveFormsModule],
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
    SwipeLeftNoConfirmationDirective,
    RecipyConstructorComponent,
    AddIngredientComponent,
    AddStepComponent,
    FileUploadComponent,
    ProductAutocompleteComponent,
    LongPressDirective,
    IngredientComponent,
    RecipyShortViewComponent,
    AddProductFormComponent,
    InputWithAutocompleteComponent,
    CostOfRecipyComponent,
    LastPreparedDatePipe,
  ],
  providers: [NormalizeDisplayedAmountPipe, ConvertToSelectedUnitPipe],
})
export class SharedModule {}
