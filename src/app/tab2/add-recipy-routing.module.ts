import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddRecipyPage } from './add-recipy.page';

const routes: Routes = [
  {
    path: '',
    component: AddRecipyPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddRecipyPageRoutingModule {}
