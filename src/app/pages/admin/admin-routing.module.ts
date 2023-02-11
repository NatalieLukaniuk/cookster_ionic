import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminPage } from './admin.page';
import { ProductsComponent } from './pages/products/products.component';
import { RecipiesCommentsComponent } from './pages/recipies-comments/recipies-comments.component';
import { RecipiesComponent } from './pages/recipies/recipies.component';
import { UpdateProductsComponent } from './pages/update-products/update-products.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPage
  },
  {
    path: 'recipies',
    component: RecipiesComponent,
    pathMatch: 'full',
  },
  {
    path: 'products',
    component: ProductsComponent,
    pathMatch: 'full',
  },
  {
    path: 'update-products',
    component: UpdateProductsComponent,
    pathMatch: 'full',
  },
  {
    path: 'recipies-comments',
    component: RecipiesCommentsComponent,
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
