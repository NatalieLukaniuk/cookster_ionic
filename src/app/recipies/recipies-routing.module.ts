import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipiesContainer } from './recipies.page';

const routes: Routes = [
  {
    path: '',
    component: RecipiesContainer,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipiesPageRoutingModule {}
