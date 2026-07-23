import { Component, inject } from '@angular/core';
import { UserDataService } from '../services/user-data.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  userDataService = inject(UserDataService);
  $isLoggedIn = this.userDataService.isUserLoggedIn;

  isProfileMenuOpen = false;



}
