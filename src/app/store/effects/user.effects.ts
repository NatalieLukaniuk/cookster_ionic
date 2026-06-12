import { select, Store } from '@ngrx/store';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import * as UserActions from '../actions/user.actions';
import { UserActionTypes } from '../actions/user.actions';
import { IAppState } from '../reducers';
import * as _ from 'lodash';
import { User } from 'src/app/models/auth.models';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { UiService } from 'src/app/services/ui.service';

// TODO: registration should be done in effects too
@Injectable()
export class UserEffects {
  uiService = inject(UiService);

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActionTypes.UPDATE_USER),
      switchMap((action: UserActions.UpdateUserAction) =>
        this.authService.updateUser(action.user.id!, action.user).pipe(
          switchMap((res: User) => {
            this.uiService.showSuccessMessage(action.successMessage)
            return [
            new UserActions.UpdateUserSuccessfulAction(res),            
          ]}),
          
        )
      )
    )
  );

  updatePreferences$ = createEffect(() => this.actions$.pipe(
    ofType(UserActionTypes.UPDATE_PREFERENCES),
    switchMap((action: UserActions.UpdatePreferencesAction) => this.store.pipe(select(getCurrentUser), take(1)).pipe(
      map(user => {
        if (user) {
          let updatedUser = _.cloneDeep(user);
          updatedUser.preferences = action.preferences;
          return updatedUser
        } else {
          return user
        }
      }),
      switchMap(user => {
        if (user) {
          return [new UserActions.UpdateUserAction(user, 'Налаштування збережено')]
        } else return of(new UserActions.UserLoggedOutAction)
      }),
    ))
  ))

  updateFamily$ = createEffect(() => this.actions$.pipe(
    ofType(UserActionTypes.UPDATE_FAMILY),
    switchMap((action: UserActions.UpdateFamilyAction) => this.store.pipe(select(getCurrentUser), take(1)).pipe(
      map(user => {
        if (user) {
          let updatedUser = _.cloneDeep(user);
          updatedUser.family = action.family;
          return updatedUser
        } else {
          return user
        }
      }),
      switchMap(user => {
        if (user) {
          return [new UserActions.UpdateUserAction(user, 'Налаштування сім\'ї збережено')]
        } else return of(new UserActions.UserLoggedOutAction)
      }),
     
    ))
  ))

  createCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActionTypes.CREATE_RECIPY_COLLECTION),
      switchMap((action: UserActions.CreateRecipyCollection) =>
        this.store.pipe(
          select(getCurrentUser),
          take(1),
          map((user: User | null) => {
            if (user) {
              let updatedUser = _.cloneDeep(user);
              if (updatedUser.collections) {
                updatedUser.collections.push({
                  name: action.collectionName,
                  recipies: [],
                });
              } else
                updatedUser.collections = [
                  { name: action.collectionName, recipies: [] },
                ];
              return new UserActions.UpdateUserAction(
                updatedUser,
                `Колекція ${action.collectionName} створена`
              );
            } else return new UserActions.UserLoggedOutAction
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthApiService,
    private store: Store<IAppState>,
  ) { }
}
