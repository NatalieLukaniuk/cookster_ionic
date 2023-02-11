import { UpdateProductsComponent } from './pages/update-products/update-products.component';
import { RecipiesCommentsComponent } from './pages/recipies-comments/recipies-comments.component';
import { ProductsComponent } from './pages/products/products.component';
import { RecipiesComponent } from './pages/recipies/recipies.component';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminPageRoutingModule } from './admin-routing.module';

import { AdminPage } from './admin.page';
import { AdminTableComponent } from './components/admin-table/admin-table.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminPageRoutingModule,
    SharedModule,
  ],
  declarations: [
    AdminPage,
    RecipiesComponent,
    ProductsComponent,
    RecipiesCommentsComponent,
    UpdateProductsComponent,
    AdminTableComponent
  ],
})
export class AdminPageModule {}
