import { Role, UserMappingItem } from './../models/auth.models';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import { User } from '../models/auth.models';

import * as UserActions from '../store/actions/user.actions';
import { AuthApiService } from './auth-api.service';
import { UiService } from './ui.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  uiService = inject(UiService);

  currentUser: User | undefined;
  allUsers: User[] | undefined;
  userAtFirebaseAuth: User | undefined;

  currentUserId = '';

  allUsersMapping: UserMappingItem[] = [];

  constructor(private authApiService: AuthApiService, private store: Store) { }

  getUserData(user: User) {
    this.authApiService
      .getAllUsers()
      .pipe(take(1))
      .subscribe((userMappingData: UserMappingItem[]) => {
        this.allUsersMapping = userMappingData;
        const found = userMappingData.find(fbUser => fbUser.firebaseId === user.uid);
        if (found) {
          this.getCurrentUserData(found.cooksterId);         
        } else {
          this.uiService.setError('no such user found');
        }
      })
  }

  getCurrentUserData(cooksterId: string) {
    this.authApiService.getUser(cooksterId).pipe(take(1)).subscribe(user => {
      this.currentUser = user;
      if (!this.currentUser.id) {
        this.currentUser.id = cooksterId;
        this.currentUserId = cooksterId;
      }
      if (user.id) {
        this.currentUserId = user.id;
      }
      if (!('plannedRecipies' in this.currentUser!)) {
        this.currentUser!.plannedRecipies = [];
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
          this.uiService.showSuccessMessage(
            'Your registration was successful'
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
