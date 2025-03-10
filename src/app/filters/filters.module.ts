import { SearchRecipiesFilterComponent } from './components/search-recipies-filter/search-recipies-filter.component';
import { ActiveFiltersWidgetComponent } from './components/active-filters-widget/active-filters-widget.component';
import { FiltersComponent } from './components/filters/filters.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { ActiveFiltersExpensesWidgetComponent } from './components/active-filters-expenses-widget/active-filters-expenses-widget.component';
import { DishTypeSelectorComponent } from './components/dish-type-selector/dish-type-selector.component';
import { CollectionSelectorComponent } from './components/collection-selector/collection-selector.component';

@NgModule({
  declarations: [
    FiltersComponent,
    ActiveFiltersWidgetComponent,
    SearchRecipiesFilterComponent,
    ActiveFiltersExpensesWidgetComponent,
    DishTypeSelectorComponent,
    CollectionSelectorComponent
  ],
  imports: [CommonModule, IonicModule, SharedModule],
  exports: [
    FiltersComponent,
    ActiveFiltersWidgetComponent,
    SearchRecipiesFilterComponent,
    ActiveFiltersExpensesWidgetComponent,
    DishTypeSelectorComponent
  ],
})
export class FiltersModule {}
