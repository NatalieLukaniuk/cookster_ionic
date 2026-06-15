import { Component, computed, inject, input } from '@angular/core';
import { Role, User } from 'src/app/models/auth.models';
import {
  ComplexityDescription,
  DishType,
  Recipy,
} from 'src/app/models/recipies.models';
import { RecipiesService } from 'src/app/services/recipies.service';

@Component({
  selector: 'app-info-tab',
  templateUrl: './info-tab.component.html',
  styleUrls: ['./info-tab.component.scss'],
})
export class InfoTabComponent {
  recipiesService = inject(RecipiesService);

  recipy = input.required<Recipy>();

  currentUser = input.required<User | null>();

  $tags = computed(() => this.recipy().type.map((tag: DishType) => DishType[tag]))
  $complexity = computed(() => ComplexityDescription[this.recipy().complexity])
  $activeTime = computed(() => this.recipy().steps.reduce((acc, step) => acc + Number(step.timeActive ?? 0), 0))
  $passiveTime = computed(() => this.recipy().steps.reduce((acc, step) => acc + Number(step.timePassive ?? 0), 0))


  $isUserAdmin = computed(() => !!(this.currentUser()?.role == Role.Admin))


  onisCheckedAndApprovedClicked(event: any) {
    let updatedRecipy: Recipy = {
      ...this.recipy(),
      isCheckedAndApproved: event.detail.checked,
    } as Recipy;
    this.recipiesService.updateRecipy(updatedRecipy).subscribe();
  }

}
