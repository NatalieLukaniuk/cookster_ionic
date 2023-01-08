import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/reducers';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';

@Component({
  selector: 'app-recipies',
  templateUrl: 'recipies.page.html',
  styleUrls: ['recipies.page.scss']
})
export class RecipiesContainer {

  recipies$ = this.store.pipe(select(getAllRecipies));
  user$ = this.store.pipe(select(getCurrentUser))

  constructor(private store: Store<IAppState>) {}

}
