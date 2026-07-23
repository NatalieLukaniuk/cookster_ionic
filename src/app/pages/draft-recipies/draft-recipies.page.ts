
import { DraftRecipy } from './../../models/recipies.models';
import { Component, inject } from '@angular/core';
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
    this.userDataService.deleteDraftRecipy(i)
  }
}
