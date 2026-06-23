import { Recipy } from 'src/app/models/recipies.models';
import { Component, computed, inject, input, output } from '@angular/core';

import { UserDataService } from 'src/app/services/user-data.service';
import { RecipiesService } from 'src/app/services/recipies.service';

@Component({
  selector: 'app-add-recipy-to-no-show',
  templateUrl: './add-recipy-to-no-show.component.html',
  styleUrls: ['./add-recipy-to-no-show.component.scss'],
})
export class AddRecipyToNoShowComponent {
  userDataService = inject(UserDataService);
  recipiesService = inject(RecipiesService);

  recipy = input.required<Recipy>();
  buttonColor = input('primary');
  isSmall = input(true);
  btnClicked = output<void>()

  $noShowIds = this.recipiesService.$noShowIds;
  $isHidden = computed(() => this.$noShowIds().includes(this.recipy().id));
  $isUserLoggedIn = this.userDataService.isUserLoggedIn;

  

  toggleNoShow() {
    if (!this.$isHidden()) {
      const updatedNoShowIds = this.$noShowIds().concat(this.recipy().id);
      this.userDataService.updateNoShowRecipies(updatedNoShowIds)
    } else if (this.$isHidden()) {
      const updatedNoShowIds = this.$noShowIds().filter(id => this.recipy().id !== id);
      this.userDataService.updateNoShowRecipies(updatedNoShowIds)
    }
    this.btnClicked.emit()
  }
}
