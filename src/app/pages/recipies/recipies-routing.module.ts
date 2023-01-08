import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipiesContainer } from './pages/all-recipies-page/recipies.page';
import { FullRecipyPageComponent } from './pages/full-recipy-page/full-recipy-page.component';

const routes: Routes = [
  {
    path: '',
    component: RecipiesContainer,
  },
  {
    path: 'recipy/:id',
    component: FullRecipyPageComponent,
    pathMatch: 'full',
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipiesPageRoutingModule {}
