import { DeleteDraftRecipyAction } from './../../store/actions/recipies.actions';
import { DraftRecipy } from './../../models/recipies.models';
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs';
import { IAppState } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-draft-recipies',
    templateUrl: './draft-recipies.page.html',
    styleUrls: ['./draft-recipies.page.scss'],
    standalone: false
})
export class DraftRecipiesPage implements OnInit {
  draftRecipies$ = this.store.pipe(
    select(getCurrentUser),
    map((user) => (user?.draftRecipies ? user.draftRecipies : []))
  );

  constructor(
    private store: Store<IAppState>,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}

  editDraft(draft: DraftRecipy, i: number) {
    console.log(draft);
    this.router.navigate(['tabs', 'draft-recipies', 'edit-draft'], {
      relativeTo: this.route.parent,
      queryParams: {
        order: i,
      },
    });
  }

  deleteDraft(i: number) {
    this.store.dispatch(new DeleteDraftRecipyAction(i));
  }
}
