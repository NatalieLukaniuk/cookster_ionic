
import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Ingredient, Recipy } from 'src/app/models/recipies.models';
import { UiService } from 'src/app/services/ui.service';
import { RecipiesService } from 'src/app/services/recipies.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-full-recipy-page',
  templateUrl: './full-recipy-page.component.html',
  styleUrls: ['./full-recipy-page.component.scss'],
})
export class FullRecipyPageComponent implements OnDestroy {
  uiService = inject(UiService);
  recipiesService = inject(RecipiesService);
  userDataService = inject(UserDataService);

  $isAdmin = this.userDataService.isAdmin;
  $userEmail = this.userDataService.userEmail;
  $isCanEdit = computed(() => this.$userEmail() === this.$recipy()?.author || this.$isAdmin())
  $isShowApproveBtn = computed(() => this.$isAdmin() && this.$recipy()?.notApproved)
  
  $recipyId = signal<string>('');

  $recipy = computed(() => {
    const found = this.recipiesService.getRecipies().find((recipy) => recipy.id === this.$recipyId());
    if(!found) return null;

    const updatedRecipy: Recipy = {
      ...found
    }
    updatedRecipy.ingrediends.sort((a: Ingredient, b: Ingredient) => b.amount - a.amount);
    this.titleService.setTitle(updatedRecipy.name);
    return updatedRecipy
  })

 constructor(private router: Router, private titleService: Title) {
    const path = window.location.pathname.split('/');
    this.$recipyId.set(path[path.length - 1]);
  }
  ngOnDestroy(): void {
    this.titleService.setTitle('Cookster')
  }


  goEditRecipy() {
    this.router.navigate(['tabs', 'recipies', 'edit-recipy', this.$recipyId()]);
  }

  approveRecipy(){
    const currentRecipy = this.$recipy()
    if(currentRecipy){
      const updated = {...currentRecipy, notApproved: false};
      this.recipiesService.updateRecipy(updated);
    }
  }
  
}
