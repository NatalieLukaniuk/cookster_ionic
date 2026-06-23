import { DeleteDraftRecipyAction } from './../../store/actions/recipies.actions';
import { DraftRecipy } from './../../models/recipies.models';
import { Component, inject, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs';
import { IAppState } from 'src/app/store/reducers';
import { Router, ActivatedRoute } from '@angular/router';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-draft-recipies',
  templateUrl: './draft-recipies.page.html',
  styleUrls: ['./draft-recipies.page.scss'],
})
export class DraftRecipiesPage {
  userDataService = inject(UserDataService);
  $draftRecipies = this.userDataService.userDraftRecipies;


  constructor(
    private store: Store<IAppState>,
    private router: Router,
    private route: ActivatedRoute
  ) {}


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
