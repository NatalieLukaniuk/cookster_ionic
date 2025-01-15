import { ExpensesApiService } from 'src/app/services/expenses-api.service';
import { Role, UserMappingItem } from './../models/auth.models';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import { User } from '../models/auth.models';

import * as UserActions from '../store/actions/user.actions';
import * as UIActions from '../store/actions/ui.actions';
import { AuthApiService } from './auth-api.service';
import { ExpensesLoadedAction } from '../store/actions/expenses.actions';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentUser: User | undefined;
  allUsers: User[] | undefined;
  userAtFirebaseAuth: User | undefined;

  currentUserId = '';

  allUsersMapping: UserMappingItem[] = [];

  constructor(private authApiService: AuthApiService, private store: Store, private expApi: ExpensesApiService) { }

  getUserData(user: User) {
    this.authApiService
      .getAllUsers()
      .pipe(take(1))
      .subscribe((userMappingData: UserMappingItem[]) => {
        this.allUsersMapping = userMappingData;
        const found = userMappingData.find(fbUser => fbUser.firebaseId === user.uid);
        if (found) {
          this.getCurrentUserData(found.cooksterId);
          this.expApi.userCooksterId = found.cooksterId;
          this.expApi.getExpenses().pipe(take(1)).subscribe(res => {
            this.store.dispatch(new ExpensesLoadedAction(res?.expenses || []))
          })
        } else {
          this.store.dispatch(new UIActions.ErrorAction('no such user found'));
        }
      })
  }

  getCurrentUserData(cooksterId: string) {
    this.authApiService.getUser(cooksterId).pipe(take(1)).subscribe(user => {
      this.currentUser = user;
      if (user.id) {
        this.currentUserId = user.id;
      }
      if (!('details' in this.currentUser!)) {
        this.currentUser!.details = [];
      }
      this.store.dispatch(new UserActions.UserLoadedAction(user));
    })
  }

  addUser(auth: any) {
    let user = {
      email: auth.currentUser?.email,
      recipies: [],
      uid: auth.currentUser?.uid,
    };
    this.authApiService
      .addUser(user)
      .pipe(take(1))
      .subscribe((res) => {
        const userToAdd = {
          email: user.email,
          firebaseId: user.uid,
          cooksterId: res.name
        }
        let updatedUsers: UserMappingItem[] = this.allUsersMapping.concat(userToAdd)
        this.authApiService.addNewUser(updatedUsers).pipe(take(1)).subscribe(() => {
          this.store.dispatch(
            new UIActions.ShowSuccessMessageAction(
              'Your registration was successful'
            )
          );
          this.getCurrentUserData(res.name);
        })
      });
  }

  updateUserDetailsFromMyDatabase(newData: any) {
    if (this.currentUser?.id) {
      return this.authApiService.updateUser(this.currentUser.id, newData);
    } else {
      return of(null);
    }
  }
}
