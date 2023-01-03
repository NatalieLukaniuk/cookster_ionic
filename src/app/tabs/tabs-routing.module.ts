import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'recipies',
        loadChildren: () => import('../recipies/recipies.module').then(m => m.RecipiesPageModule)
      },
      {
        path: 'add-recipy',
        loadChildren: () => import('../add-recipy/add-recipy.module').then(m => m.AddRecipyPageModule)
      },
      {
        path: 'planner',
        loadChildren: () => import('../planner/planner.module').then(m => m.PlannerPageModule)
      },
      {
        path: 'shopping-list',
        loadChildren: () => import('../shopping-list/shopping-list.module').then( m => m.ShoppingListPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/recipies',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/recipies',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
