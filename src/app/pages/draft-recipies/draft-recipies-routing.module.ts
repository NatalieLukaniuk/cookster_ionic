import { EditDraftComponent } from './pages/edit-draft/edit-draft.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DraftRecipiesPage } from './draft-recipies.page';

const routes: Routes = [
  {
    path: '',
    component: DraftRecipiesPage
  },
  {
    path: 'edit-draft',
    component: EditDraftComponent,
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DraftRecipiesPageRoutingModule {}
