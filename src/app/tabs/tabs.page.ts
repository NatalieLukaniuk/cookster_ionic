import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { IAppState } from './../store/reducers/index';
import { Store, select } from '@ngrx/store';
import { Component } from '@angular/core';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss'],
    standalone: false
})
export class TabsPage {
  isLoggedIn$ = this.store.pipe(select(getCurrentUser));

  isProfileMenuOpen = false;

  constructor(
    private store: Store<IAppState>,
  ) {}

}
