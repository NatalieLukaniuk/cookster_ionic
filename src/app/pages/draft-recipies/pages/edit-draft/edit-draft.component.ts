import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, combineLatest, map, filter } from 'rxjs';
import { DraftRecipy } from 'src/app/models/recipies.models';
import { IAppState } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

@Component({
    selector: 'app-edit-draft',
    templateUrl: './edit-draft.component.html',
    styleUrls: ['./edit-draft.component.scss'],
    standalone: false
})
export class EditDraftComponent implements OnInit {
  recipy$: Observable<DraftRecipy>;

  draftRecipies$ = this.store.pipe(
    select(getCurrentUser),
    map((user) => (user?.draftRecipies ? user.draftRecipies : []))
  );

  currentDraftOrder$ = this.route.queryParams.pipe(
    map((params) => params['order'])
  );

  currentUser$ = this.store.pipe(
    select(getCurrentUser),
    filter((user) => !!user)
  );

  constructor(private store: Store<IAppState>, private route: ActivatedRoute) {
    this.recipy$ = combineLatest([
      this.draftRecipies$,
      this.currentDraftOrder$,
    ]).pipe(
      filter((res) => !!res[0].length),
      map((res) => {
        let [draftRecipies, order] = res;
        return draftRecipies[order];
      })
    );
  }

  ngOnInit() {}
}
