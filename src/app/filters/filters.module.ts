import { ActiveFiltersWidgetComponent } from './components/active-filters-widget/active-filters-widget.component';
import { FiltersComponent } from './components/filters/filters.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [FiltersComponent, ActiveFiltersWidgetComponent],
  imports: [
    CommonModule,
    IonicModule,
    SharedModule
  ],
  exports: [FiltersComponent, ActiveFiltersWidgetComponent]
})
export class FiltersModule { }
