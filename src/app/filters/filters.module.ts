import { SearchRecipiesFilterComponent } from './components/search-recipies-filter/search-recipies-filter.component';
import { ActiveFiltersWidgetComponent } from './components/active-filters-widget/active-filters-widget.component';
import { FiltersComponent } from './components/filters/filters.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { DishTypeSelectorComponent } from './components/dish-type-selector/dish-type-selector.component';
import { CollectionSelectorComponent } from './components/collection-selector/collection-selector.component';
import { SortingFilterComponent } from './components/sorting-filter/sorting-filter.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    FiltersComponent,
    ActiveFiltersWidgetComponent,
    SearchRecipiesFilterComponent,
    DishTypeSelectorComponent,
    CollectionSelectorComponent,
    SortingFilterComponent
  ],
  imports: [CommonModule, IonicModule, SharedModule, FormsModule],
  exports: [
    FiltersComponent,
    ActiveFiltersWidgetComponent,
    SearchRecipiesFilterComponent,
    DishTypeSelectorComponent
  ],
})
export class FiltersModule {}
