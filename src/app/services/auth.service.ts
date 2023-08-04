import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { Role, User } from '../models/auth.models';
import * as UIActions from '../store/actions/ui.actions';
import * as UserActions from '../store/actions/user.actions';

import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private userService: UserService, private store: Store) {}

  registerUser(email: string, password: string) {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential: { user: any }) => {
        this.processIsLoggedIn(userCredential.user);
        this.userService.addUser(auth);
      })
      .catch((error: { code: any; message: any }) => {
        this.store.dispatch(new UIActions.ErrorAction(error.message));
      });
  }

  loginUser(email: string, password: string) {
    this.store.dispatch(new UIActions.SetIsLoadingAction());
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential: { user: any }) => {
        // Signed in
        this.processIsLoggedIn(userCredential.user);
        this.store.dispatch(new UIActions.SetIsLoadingFalseAction());
      })
      .catch((error: { code: any; message: any }) => {
        this.store.dispatch(new UIActions.SetIsLoadingFalseAction());
        this.store.dispatch(new UIActions.ErrorAction(error.message));
      });
  }

  logoutUser() {
    this.store.dispatch(new UIActions.SetIsLoadingAction());
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        this.processIsNotLoggedIn();
        this.store.dispatch(new UIActions.SetIsLoadingFalseAction());
      })
      .catch((error) => {
        this.store.dispatch(new UIActions.SetIsLoadingFalseAction());
        this.store.dispatch(new UIActions.ErrorAction(error.message));
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
    this.store.dispatch(new UserActions.UserLoggedOutAction());
  }
}
