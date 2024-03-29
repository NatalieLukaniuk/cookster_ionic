import { PlannerCoreComponent } from './pages/planner-core/planner-core.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlannerPage } from './planner.page';
import { ViewRecipyComponent } from './pages/view-recipy/view-recipy.component';

const routes: Routes = [
  {
    path: '',
    component: PlannerPage,
  },
  {
    path: 'by-date/:id',
    component: PlannerCoreComponent,
  },
  {
    path: 'recipy/:id',
    component: ViewRecipyComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlannerPageRoutingModule {}
