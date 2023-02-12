import { DataMappingService } from 'src/app/services/data-mapping.service';
import { SetIsLoadingAction } from './../actions/ui.actions';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';

import { RecipiesActionTypes } from '../actions/recipies.actions';
import * as RecipiesActions from '../actions/recipies.actions';
import * as UiActions from '../actions/ui.actions';
import { select, Store } from '@ngrx/store';
import { RecipiesApiService } from 'src/app/services/recipies-api.service';
import { Product, Recipy } from 'src/app/models/recipies.models';
import { ProductsApiService } from 'src/app/services/products-api.service';
import { getCurrentUser } from '../selectors/user.selectors';
import * as _ from 'lodash';
import { UpdateUserAction } from '../actions/user.actions';

@Injectable()
export class RecipiesEffects {
  getRecipies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipiesActionTypes.GET_RECIPIES),
      switchMap((action: RecipiesActions.GetRecipiesAction) =>
        this.recipiesService.getRecipies().pipe(
          map((res: Object) => {
            let array = Object.entries(res);
            let recipies: any = [];
            for (let entry of array) {
              let recipy: any = {
                id: entry[0],
                ...entry[1],
              };
              recipies.push(recipy);
            }
            recipies.reverse();
            return recipies;
          }),
          map((res: Recipy[]) => new RecipiesActions.RecipiesLoadedAction(res))
        )
      ),
      catchError((error) => of(new UiActions.ErrorAction(error)))
    )
  );

  getProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipiesActionTypes.GET_PRODUCTS),
      switchMap((action: RecipiesActions.GetProductsAction) =>
        this.productsApiService.getProducts().pipe(
          map((res: Object) => {
            let array = Object.entries(res);
            let products: any = [];
            for (let entry of array) {
              let product: any = {
                id: entry[0],
                ...entry[1],
              };
              products.push(product);
            }
            products.reverse();
            return products;
          }),
          map((res: Product[]) => new RecipiesActions.ProductsLoadedAction(res))
        )
      ),
      catchError((error) => of(new UiActions.ErrorAction(error)))
    )
  );

  addNewRecipy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipiesActionTypes.ADD_RECIPY),
      map((action: RecipiesActions.AddNewRecipyAction) => {
        let updated = {
          ...action,
          recipy: {
            ...action.recipy,
            calorificValue: this.dataMapping.countRecipyCalorificValue(
              action.recipy.ingrediends
            ),
          },
        };
        this.store.dispatch(new SetIsLoadingAction());
        return updated;
      }),
      switchMap((action: RecipiesActions.AddNewRecipyAction) =>
        this.recipiesService.addRecipy(action.recipy).pipe(
          switchMap((res: { name: string }) => {
            let recipy: Recipy = {
              ...action.recipy,
              id: res.name,
            };
            return [
              new RecipiesActions.AddNewRecipySuccessAction(recipy),
              new UiActions.ShowSuccessMessageAction(
                `${recipy.name} has been added to the recipies database`
              ),
              new UiActions.SetIsLoadingFalseAction(),
            ];
          }),
          catchError((error) => of(new UiActions.ErrorAction(error)))
        )
      )
    )
  );

  addDraftRecipy$ = createEffect(() =>
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
              return new UpdateUserAction(updatedUser);
            } else return new UiActions.ErrorAction('no user');
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
              return new UpdateUserAction(updatedUser);
            } else return new UiActions.ErrorAction('no user');
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
                  (item) =>
                    item.name !== action.recipy.name &&
                    item.createdOn !== action.recipy.createdOn
                );
              }
              return new UpdateUserAction(updatedUser);
            } else return new UiActions.ErrorAction('no user');
          })
        )
      )
    )
  );

  updateRecipy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipiesActionTypes.UPDATE_RECIPY),
      map((action: RecipiesActions.UpdateRecipyAction) => {
        this.store.dispatch(new SetIsLoadingAction());
        let updated = {
          ...action,
          recipy: {
            ...action.recipy,
            calorificValue: this.dataMapping.countRecipyCalorificValue(
              action.recipy.ingrediends
            ),
          },
        };
        return updated;
      }),
      switchMap((action: RecipiesActions.UpdateRecipyAction) =>
        this.recipiesService.updateRecipy(action.recipy.id, action.recipy).pipe(
          switchMap((res: any) => {
            return [
              new RecipiesActions.UpdateRecipySuccessAction(res),
              new UiActions.SetIsLoadingFalseAction(),
            ];
          }),
          catchError((error) => of(new UiActions.ErrorAction(error)))
        )
      )
    )
  );

  updateProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipiesActionTypes.UPDATE_PRODUCT),
      tap(() => this.store.dispatch(new UiActions.SetIsLoadingAction())),
      switchMap((action: RecipiesActions.UpdateProductAction) =>
        this.productsApiService
          .updateProduct(action.product.id, action.product)
          .pipe(
            switchMap((res: any) => {
              return [
                new RecipiesActions.UpdateProductSuccessAction(res),
                new UiActions.SetIsLoadingFalseAction(),
              ];
            }),
            catchError((error) => of(new UiActions.ErrorAction(error)))
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
          catchError((error) => of(new UiActions.ErrorAction(error)))
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
