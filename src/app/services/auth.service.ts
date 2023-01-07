import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { Role, User } from '../models/auth.models';
import * as UIActions from '../store/actions/ui.actions';
import * as UserActions from '../store/actions/user.actions';

import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(private userService: UserService, private store: Store) {}

  registerUser(email: string, password: string) {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential: { user: any }) => {
        this.userService.userAtFirebaseAuth = userCredential.user;
        this.isLoggedIn.next(true);
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
      this.store.dispatch(new UserActions.UserLoadedAction(currentUser));
    }

    this.userService.userAtFirebaseAuth = user;
    this.isLoggedIn.next(true);
  }

  processIsNotLoggedIn() {
    this.isLoggedIn.next(false);
    this.store.dispatch(new UserActions.UserLoggedOutAction());
  }
}