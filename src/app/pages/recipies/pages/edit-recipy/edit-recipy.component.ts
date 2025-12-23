import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { tap, filter, map } from 'rxjs';
import {
  SetIsLoadingAction,
  SetIsLoadingFalseAction,
} from 'src/app/store/actions/ui.actions';
import { IAppState } from 'src/app/store/reducers';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

@Component({
  selector: 'app-edit-recipy',
  templateUrl: './edit-recipy.component.html',
  styleUrls: ['./edit-recipy.component.scss'],
})
export class EditRecipyComponent implements OnInit {
  recipyId: string;
  recipy$ = this.store.pipe(
    select(getAllRecipies),
    filter((res) => !!res.length),
    tap(() => this.store.dispatch(new SetIsLoadingAction())),
    map((res) => res.find((recipy) => recipy.id === this.recipyId)),
    map((recipy) => {
      if (recipy && recipy.ingrediends) {
        let updatedRecipy = _.cloneDeep(recipy);
        updatedRecipy.ingrediends.sort((a, b) => b.amount - a.amount);
        this.store.dispatch(new SetIsLoadingFalseAction());
        return updatedRecipy;
      } else return recipy;
    })
  );

  user$ = this.store.pipe(select(getCurrentUser));
  
  constructor(private store: Store<IAppState>) {
    const path = window.location.pathname.split('/');
    this.recipyId = path[path.length - 1];
  }

  ngOnInit() {}
}
