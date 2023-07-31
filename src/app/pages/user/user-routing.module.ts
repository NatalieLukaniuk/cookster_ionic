import { GenericSettingsComponent } from './components/generic-settings/generic-settings.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserPage } from './user.page';
import { EditFamilyComponent } from './components/edit-family/edit-family.component';

const routes: Routes = [
  {
    path: '',
    component: UserPage
  },
  {
    path: 'settings',
    pathMatch: 'full',
    component: GenericSettingsComponent
  },
  {
    path: 'family-settings',
    pathMatch: 'full',
    component: EditFamilyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPageRoutingModule {}
