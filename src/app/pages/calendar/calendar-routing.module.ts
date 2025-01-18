import { CalendarRecipyFullViewComponent } from './components/calendar-recipy-full-view/calendar-recipy-full-view.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalendarPage } from './calendar.page';
import { ViewRecipiesComponent } from './components/view-recipies/view-recipies.component';

const routes: Routes = [
  {
    path: '',
    component: CalendarPage
  },
  {
    path: 'view-recipies',
    component: ViewRecipiesComponent
  },
  {
    path: 'recipy/:entryId',
    component: CalendarRecipyFullViewComponent,
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarPageRoutingModule {}
