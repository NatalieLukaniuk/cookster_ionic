import { CalendarRecipyFullViewComponent } from './pages/calendar-recipy-full-view/calendar-recipy-full-view.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalendarPage } from './calendar.page';
import { ViewRecipiesComponent } from './pages/view-recipies/view-recipies.component';

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
    path: 'recipy/:id',
    component: CalendarRecipyFullViewComponent,
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarPageRoutingModule {}
