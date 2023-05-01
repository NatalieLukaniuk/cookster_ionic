import { EditRecipyComponent } from './pages/edit-recipy/edit-recipy.component';
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
  {
    path: 'edit-recipy/:id',
    component: EditRecipyComponent,
    pathMatch: 'full',
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipiesPageRoutingModule {}
