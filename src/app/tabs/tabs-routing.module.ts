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
        loadChildren: () => import('../pages/calendar/calendar.module').then(m => m.CalendarModule)
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
        path: 'profile',
        loadChildren: () => import('../pages/user/user.module').then(m => m.UserPageModule)
      },
      {
        path: 'draft-recipies',
        loadChildren: () => import('../pages/draft-recipies/draft-recipies.module').then( m => m.DraftRecipiesPageModule)
      },
      {
        path: 'admin',
        loadChildren: () => import('../pages/admin/admin.module').then( m => m.AdminPageModule)
      },
      {
        path: 'expenses',
        loadChildren: () => import('../expenses/expenses.module').then( m => m.ExpensesModule)
      },
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
