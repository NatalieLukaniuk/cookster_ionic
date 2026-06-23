import { Component, computed, inject, input } from '@angular/core';
import { Role, User } from 'src/app/models/auth.models';
import {
  ComplexityDescription,
  DishType,
  Recipy,
} from 'src/app/models/recipies.models';
import { RecipiesService } from 'src/app/services/recipies.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-info-tab',
  templateUrl: './info-tab.component.html',
  styleUrls: ['./info-tab.component.scss'],
})
export class InfoTabComponent {
  recipiesService = inject(RecipiesService);
  userDataService = inject(UserDataService);

  recipy = input.required<Recipy>();

  $tags = computed(() => this.recipy().type.map((tag: DishType) => DishType[tag]))
  $complexity = computed(() => ComplexityDescription[this.recipy().complexity])
  $activeTime = computed(() => this.recipy().steps.reduce((acc, step) => acc + Number(step.timeActive ?? 0), 0))
  $passiveTime = computed(() => this.recipy().steps.reduce((acc, step) => acc + Number(step.timePassive ?? 0), 0))


  $isUserAdmin = this.userDataService.isAdmin;

  onisCheckedAndApprovedClicked(event: any) {
    let updatedRecipy: Recipy = {
      ...this.recipy(),
      isCheckedAndApproved: event.detail.checked,
    } as Recipy;
    this.recipiesService.updateRecipy(updatedRecipy).subscribe();
  }

}
