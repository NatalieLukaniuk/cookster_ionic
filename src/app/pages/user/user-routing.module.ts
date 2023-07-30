import { GenericSettingsComponent } from './components/generic-settings/generic-settings.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserPage } from './user.page';

const routes: Routes = [
  {
    path: '',
    component: UserPage
  },
  {
    path: 'settings',
    component: GenericSettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPageRoutingModule {}
