import { Component, computed, inject, signal } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Recipy, Ingredient } from 'src/app/models/recipies.models';
import { RecipiesService } from 'src/app/services/recipies.service';
import { UiService } from 'src/app/services/ui.service';

import { IAppState } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

@Component({
  selector: 'app-edit-recipy',
  templateUrl: './edit-recipy.component.html',
  styleUrls: ['./edit-recipy.component.scss'],
})
export class EditRecipyComponent {
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
    return updatedRecipy
  })

  

  user$ = this.store.pipe(select(getCurrentUser));
  
  constructor(private store: Store<IAppState>) {
    const path = window.location.pathname.split('/');
    this.$recipyId.set(path[path.length - 1]);
  }

}
