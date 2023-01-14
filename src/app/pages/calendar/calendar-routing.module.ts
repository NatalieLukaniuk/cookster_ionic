import { CalendarRecipyFullViewComponent } from './pages/calendar-recipy-full-view/calendar-recipy-full-view.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalendarPage } from './calendar.page';

const routes: Routes = [
  {
    path: '',
    component: CalendarPage
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
