import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullRecipyPageComponent } from './pages/full-recipy-page/full-recipy-page.component';
import { RecipiesContainer } from './recipies.page';

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
