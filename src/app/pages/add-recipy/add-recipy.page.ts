import { filter } from 'rxjs';
import { getCurrentUser } from './../../store/selectors/user.selectors';
import { Component } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { IAppState } from 'src/app/store/reducers';

@Component({
  selector: 'app-add-recipy',
  templateUrl: 'add-recipy.page.html',
  styleUrls: ['add-recipy.page.scss'],
})
export class AddRecipyPage {
  currentUser$ = this.store.pipe(
    select(getCurrentUser),
    filter((user) => !!user)
  );
  constructor(private store: Store<IAppState>) {}
}
