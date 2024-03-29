import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { SetIsLoadingFalseAction } from './../../../../store/actions/ui.actions';
import { filter, map, tap } from 'rxjs/operators';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { Store, select } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { IAppState } from 'src/app/store/reducers';
import { SetIsLoadingAction } from 'src/app/store/actions/ui.actions';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-full-recipy-page',
  templateUrl: './full-recipy-page.component.html',
  styleUrls: ['./full-recipy-page.component.scss'],
})
export class FullRecipyPageComponent implements OnInit {
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
  isOwnRecipy$ = combineLatest([this.user$, this.recipy$]).pipe(
    filter((res) => !!res[0] && !!res[1]),
    map((res) => res[0]?.email === res[1]?.author)
  );
  constructor(private store: Store<IAppState>, private router: Router) {
    const path = window.location.pathname.split('/');
    this.recipyId = path[path.length - 1];
  }

  ngOnInit() {}

  goEditRecipy() {
    this.router.navigate(['tabs', 'recipies', 'edit-recipy', this.recipyId]);
  }
}
