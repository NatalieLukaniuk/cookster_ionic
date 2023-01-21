import { PlannerMainComponent } from './pages/planner-main/planner-main.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlannerPage } from './planner.page';

const routes: Routes = [
  {
    path: '',
    component: PlannerPage,
  },
  {
    path: 'by-date/:id',
    component: PlannerMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlannerPageRoutingModule {}
