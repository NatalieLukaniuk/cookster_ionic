import { Role, UserMappingItem } from './../models/auth.models';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import { User } from '../models/auth.models';

import { AuthApiService } from './auth-api.service';
import { UiService } from './ui.service';
import { UserDataService } from './user-data.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  uiService = inject(UiService);
  userDataService = inject(UserDataService);

  // currentUser: User | undefined;
  allUsers: User[] | undefined;
  userAtFirebaseAuth: User | undefined;

  $currentUserId = this.userDataService.userId;

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
      this.userDataService.setCurrentUser(user);
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

 private updateUserDetailsFromMyDatabase(newData: any) { // TODO not used anywhere
    const currentUserId = this.$currentUserId()
    if (currentUserId) {
      return this.authApiService.updateUser(currentUserId, newData);
    } else {
      return of(null);
    }
  }
}
