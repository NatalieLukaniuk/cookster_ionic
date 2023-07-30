import { DensityCalcComponent } from './pages/density-calc/density-calc.component';
import { AddProductComponent } from './pages/add-product/add-product.component';
import { UpdateProductsComponent } from './pages/update-products/update-products.component';
import { RecipiesCommentsComponent } from './pages/recipies-comments/recipies-comments.component';
import { ProductsComponent } from './pages/products/products.component';
import { RecipiesComponent } from './pages/recipies/recipies.component';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    ReactiveFormsModule
  ],
  declarations: [
    AdminPage,
    RecipiesComponent,
    ProductsComponent,
    RecipiesCommentsComponent,
    UpdateProductsComponent,
    AdminTableComponent,
    AddProductComponent,
    DensityCalcComponent
  ],
})
export class AdminPageModule {}
