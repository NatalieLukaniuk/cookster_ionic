import { DeleteDraftRecipyAction } from './../../store/actions/recipies.actions';
import { DraftRecipy } from './../../models/recipies.models';
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter, map } from 'rxjs';
import { IAppState } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

@Component({
  selector: 'app-draft-recipies',
  templateUrl: './draft-recipies.page.html',
  styleUrls: ['./draft-recipies.page.scss'],
})
export class DraftRecipiesPage implements OnInit {
  draftRecipies$ = this.store.pipe(
    select(getCurrentUser),
    map((user) => (user?.draftRecipies ? user.draftRecipies : []))
  );

  constructor(private store: Store<IAppState>) {}

  ngOnInit() {}

  editDraft(draft: DraftRecipy) {
    console.log(draft);
  }

  deleteDraft(draft: DraftRecipy) {
    this.store.dispatch(new DeleteDraftRecipyAction(draft));
  }
}
