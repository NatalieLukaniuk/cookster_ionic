

import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';

import { RecipiesActionTypes } from '../actions/recipies.actions';
import * as RecipiesActions from '../actions/recipies.actions';

import { RecipiesApiService } from 'src/app/services/recipies-api.service';

import * as _ from 'lodash';
import { UiService } from 'src/app/services/ui.service';

@Injectable()
export class RecipiesEffects {
  uiService = inject(UiService);
  
  loadNewIngredients$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipiesActionTypes.GET_NEW_INGREDIENTS_ACTION),
      switchMap((action: RecipiesActions.LoadNewIngredientsAction) =>
        this.recipiesService.getIngredientsToAdd().pipe(
          map((res: any) => Object.values(res) as string[]),
          map(
            (res: string[]) =>
              new RecipiesActions.NewIngredientsLoadedAction(res)
          ),
          
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private recipiesService: RecipiesApiService,
  ) {}
}
