import { DataMappingService } from 'src/app/services/data-mapping.service';

import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';

import { RecipiesActionTypes } from '../actions/recipies.actions';
import * as RecipiesActions from '../actions/recipies.actions';

import { select, Store } from '@ngrx/store';
import { RecipiesApiService } from 'src/app/services/recipies-api.service';
import { Product, Recipy } from 'src/app/models/recipies.models';
import { ProductsApiService } from 'src/app/services/products-api.service';
import { getCurrentUser } from '../selectors/user.selectors';
import * as _ from 'lodash';
import { UpdateUserAction, UserLoggedOutAction } from '../actions/user.actions';
import { UiService } from 'src/app/services/ui.service';

@Injectable()
export class RecipiesEffects {
  uiService = inject(UiService);
  
  addDraftRecipy$ = createEffect(() => //TODO in user service
    this.actions$.pipe(
      ofType(RecipiesActionTypes.ADD_DRAFT_RECIPY),
      switchMap((action: RecipiesActions.AddDraftRecipyAction) =>
        this.store.pipe(
          select(getCurrentUser),
          take(1),
          map((user) => {
            if (user) {
              let updatedUser = _.cloneDeep(user);
              if (updatedUser.draftRecipies) {
                updatedUser.draftRecipies!.push(action.recipy);
              } else {
                updatedUser.draftRecipies = [action.recipy];
              }
              return new UpdateUserAction(
                updatedUser,
                `${action.recipy.name} додано в чернетки`
              );
            } else return new UserLoggedOutAction;
          })
        )
      )
    )
  );

  updateDraftRecipy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipiesActionTypes.UPDATE_DRAFT_RECIPY),
      switchMap((action: RecipiesActions.UpdateDraftRecipyAction) =>
        this.store.pipe(
          select(getCurrentUser),
          take(1),
          map((user) => {
            if (user) {
              let updatedUser = _.cloneDeep(user);
              if (updatedUser.draftRecipies) {
                updatedUser.draftRecipies[action.order] = action.recipy;
              }
              return new UpdateUserAction(
                updatedUser,
                `${action.recipy.name} - чернетку оновлено`
              );
            } else return new UserLoggedOutAction;
          })
        )
      )
    )
  );

  deleteDraftRecipy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipiesActionTypes.DELETE_DRAFT_RECIPY),
      switchMap((action: RecipiesActions.DeleteDraftRecipyAction) =>
        this.store.pipe(
          select(getCurrentUser),
          take(1),
          map((user) => {
            if (user) {
              let updatedUser = _.cloneDeep(user);
              if (updatedUser.draftRecipies) {
                updatedUser.draftRecipies! = updatedUser.draftRecipies.filter(
                  (item, i) => i !== action.index
                );
              }
              return new UpdateUserAction(
                updatedUser,
                `Чернетку видалено`
              );
            } else return new UserLoggedOutAction;
          })
        )
      )
    )
  );
  
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
    private dataMapping: DataMappingService,
    private productsApiService: ProductsApiService,
    private store: Store
  ) {}
}
