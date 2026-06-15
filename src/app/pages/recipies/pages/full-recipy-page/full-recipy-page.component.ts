import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { IAppState } from 'src/app/store/reducers';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Role } from 'src/app/models/auth.models';
import { Ingredient, Recipy } from 'src/app/models/recipies.models';
import { UiService } from 'src/app/services/ui.service';
import { RecipiesService } from 'src/app/services/recipies.service';

@Component({
  selector: 'app-full-recipy-page',
  templateUrl: './full-recipy-page.component.html',
  styleUrls: ['./full-recipy-page.component.scss'],
})
export class FullRecipyPageComponent implements OnDestroy {
  uiService = inject(UiService);
  recipiesService = inject(RecipiesService);
  
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


  user$ = this.store.pipe(select(getCurrentUser));
  isCanEdit$ = this.user$.pipe( // should eventually be converted to computed signal
      map((res) => res?.email === this.$recipy()?.author || res?.role === Role.Admin)
  );

  isShowApproveBtn$ = this.user$.pipe(// should eventually be converted to computed signal
    map((res) => res?.role === Role.Admin && this.$recipy()?.notApproved)
  );
  constructor(private store: Store<IAppState>, private router: Router, private titleService: Title) {
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
