import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DraftRecipiesPage } from './draft-recipies.page';

const routes: Routes = [
  {
    path: '',
    component: DraftRecipiesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DraftRecipiesPageRoutingModule {}
