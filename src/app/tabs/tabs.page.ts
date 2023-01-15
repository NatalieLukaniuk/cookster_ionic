import { AuthService } from './../services/auth.service';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { IAppState } from './../store/reducers/index';
import { Store, select } from '@ngrx/store';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  isLoggedIn$ = this.store.pipe(select(getCurrentUser));

  isProfileMenuOpen = false;

  constructor(
    private store: Store<IAppState>,
    private authService: AuthService
  ) {}

  logout() {
    this.authService.logoutUser();
  }
}
