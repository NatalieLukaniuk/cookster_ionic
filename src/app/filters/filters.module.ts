import { ActiveFiltersWidgetComponent } from './components/active-filters-widget/active-filters-widget.component';
import { FiltersComponent } from './components/filters/filters.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [FiltersComponent, ActiveFiltersWidgetComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [FiltersComponent, ActiveFiltersWidgetComponent]
})
export class FiltersModule { }
