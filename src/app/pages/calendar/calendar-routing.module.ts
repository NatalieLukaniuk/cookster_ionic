import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalendarPage } from './calendar.page';
import { ViewRecipiesComponent } from './components/view-recipies/view-recipies.component';
import { OpenedRecipiesGuardService } from './calendar.service';

const routes: Routes = [
  {
    path: '',
    component: CalendarPage
  },
  {
    path: 'view-recipies',
    component: ViewRecipiesComponent,
    canActivate: [OpenedRecipiesGuardService]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarPageRoutingModule {}
