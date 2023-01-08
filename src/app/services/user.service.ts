import { Role } from './../models/auth.models';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import { User } from '../models/auth.models';

import * as UserActions from '../store/actions/user.actions';
import * as UIActions from '../store/actions/ui.actions';
import { AuthApiService } from './auth-api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentUser: User | undefined;
  allUsers: User[] | undefined;
  userAtFirebaseAuth: User | undefined;

  constructor(private authApiService: AuthApiService, private store: Store) {}

  getAllUsers() { // FIXME: might be not needed anymore
    this.authApiService
      .getUsers()
      .pipe(take(1))
      .subscribe((res) => {
        let array = Object.entries(res);
        let users: any = [];
        for (let entry of array) {
          let user: any = {
            id: entry[0],
            ...entry[1],
          };
          users.push(user);
        }
        this.allUsers = users;
        this.getCurrentUser(this.userAtFirebaseAuth);
      });
  }

  getUserData(user: User){
    this.authApiService
    .getUsers()
    .pipe(take(1))
    .subscribe((res) => {
      let array = Object.entries(res);
      let users: any = [];
      for (let entry of array) {
        let user: any = {
          id: entry[0],
          ...entry[1],
        };
        users.push(user);
      }
      this.allUsers = users;
      this.getCurrentUser(user);
    });
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
        this.store.dispatch(
          new UIActions.ShowSuccessMessageAction(
            'Your registration was successful'
          )
        );
        this.getAllUsers();
      });
  }

  getCurrentUser(userAtFirebaseAuth: any) {
    if (this.allUsers) {
      for (let user of this.allUsers) {
        if (userAtFirebaseAuth.email === user.email) {
          console.log(user);
          this.currentUser = user;
          if (!('details' in this.currentUser!)) {
            this.currentUser!.details = [];
          }
          this.store.dispatch(new UserActions.UserLoadedAction(user));
        }
      }
    } else {
      this.store.dispatch(new UIActions.ErrorAction('no users'));
    }
  }

  updateUserDetailsFromMyDatabase(newData: any) {
    if (this.currentUser?.id) {
      return this.authApiService.updateUser(this.currentUser.id, newData);
    } else {
      return of(null);
    }
  }
}
