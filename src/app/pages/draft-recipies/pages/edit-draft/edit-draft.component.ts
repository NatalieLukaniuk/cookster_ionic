import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, take } from 'rxjs';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-edit-draft',
  templateUrl: './edit-draft.component.html',
  styleUrls: ['./edit-draft.component.scss'],
})
export class EditDraftComponent {

  userDataService = inject(UserDataService);
  $draftRecipies = this.userDataService.userDraftRecipies;

  $currentDraftOrder = signal(0)

  currentDraftOrder$ = this.route.queryParams.pipe(
    map((params) => params['order'])
  );

  $recipy = computed(() => this.$draftRecipies()[this.$currentDraftOrder()])


  constructor(private route: ActivatedRoute) {
    this.route.queryParams.pipe(take(1)).subscribe((params) => this.$currentDraftOrder.set(params['order']))    
  }

}
