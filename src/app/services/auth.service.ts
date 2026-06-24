import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { Role, User } from '../models/auth.models';

import { UserService } from './user.service';
import { UiService } from './ui.service';
import { UserDataService } from './user-data.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
uiService = inject(UiService);
userDataService = inject(UserDataService);

  constructor(private userService: UserService, private store: Store) {}

  registerUser(email: string, password: string) {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential: { user: any }) => {
        this.processIsLoggedIn(userCredential.user);
        this.userService.addUser(auth);
      })
      .catch((error: { code: any; message: any }) => {
        this.uiService.setError(error.message);
      });
  }

  loginUser(email: string, password: string) {
    this.uiService.setIsLoadingTrue();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential: { user: any }) => {
        // Signed in
        this.processIsLoggedIn(userCredential.user);
        this.uiService.setIsLoadingFalse();
      })
      .catch((error: { code: any; message: any }) => {
        this.uiService.setIsLoadingFalse();
        this.uiService.setError(error.message);
      });
  }

  logoutUser() {
    this.uiService.setIsLoadingTrue();
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        this.processIsNotLoggedIn();
        this.uiService.setIsLoadingFalse();
      })
      .catch((error) => {
        this.uiService.setIsLoadingFalse();
        this.uiService.setError(error.message);
      });
  }

  processIsLoggedIn(user: { email: any; uid: any }) {
    if (user.email) {
      let currentUser: User = {
        email: user.email,
        uid: user.uid,
        role: Role.User,
      };
      this.userService.userAtFirebaseAuth = currentUser;
      this.userService.getUserData(currentUser);
    }
  }

  processIsNotLoggedIn() {
    this.userDataService.resetCurrentUser()
  }
}
