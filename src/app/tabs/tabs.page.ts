import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { IAppState } from './../store/reducers/index';
import { Store, select } from '@ngrx/store';
import { Component, ViewChild } from '@angular/core';

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
    private authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logoutUser();
  }

  @ViewChild('popover') popover: any | undefined;

  presentPopover(e: Event) {
    this.popover!.event = e;
    this.isProfileMenuOpen = true;
  }

  goPlanner() {
    this.popover.dismiss();
    this.router.navigate(['planner']);
  }
}
