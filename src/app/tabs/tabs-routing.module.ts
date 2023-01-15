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
        loadChildren: () => import('../pages/recipies/recipies.module').then(m => m.RecipiesPageModule)
      },
      {
        path: 'add-recipy',
        loadChildren: () => import('../pages/add-recipy/add-recipy.module').then(m => m.AddRecipyPageModule)
      },
      {
        path: 'calendar',
        loadChildren: () => import('../pages/calendar/calendar.module').then(m => m.CalendarPageModule)
      },
      {
        path: 'shopping-list',
        loadChildren: () => import('../pages/shopping-list/shopping-list.module').then( m => m.ShoppingListPageModule)
      },
      {
        path: 'auth',
        loadChildren: () => import('../pages/login/login.module').then(m => m.LoginPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/recipies',
        pathMatch: 'full'
      },
      {
        path: 'planner',
        loadChildren: () => import('../pages/planner/planner.module').then(m => m.PlannerPageModule)
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
