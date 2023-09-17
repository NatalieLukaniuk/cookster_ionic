import { SearchRecipiesFilterComponent } from './components/search-recipies-filter/search-recipies-filter.component';
import { ActiveFiltersWidgetComponent } from './components/active-filters-widget/active-filters-widget.component';
import { FiltersComponent } from './components/filters/filters.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { ActiveFiltersExpensesWidgetComponent } from './components/active-filters-expenses-widget/active-filters-expenses-widget.component';

@NgModule({
  declarations: [
    FiltersComponent,
    ActiveFiltersWidgetComponent,
    SearchRecipiesFilterComponent,
    ActiveFiltersExpensesWidgetComponent,
  ],
  imports: [CommonModule, IonicModule, SharedModule],
  exports: [
    FiltersComponent,
    ActiveFiltersWidgetComponent,
    SearchRecipiesFilterComponent,
  ],
})
export class FiltersModule {}
