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

import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = new BehaviorSubject<boolean>(false);
  isCheckPerformed$ = new BehaviorSubject<boolean>(false);

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
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential: { user: any }) => {
        // Signed in
        this.userService.userAtFirebaseAuth = userCredential.user;
        this.isLoggedIn.next(true);
      })
      .catch((error: { code: any; message: any }) => {
        this.store.dispatch(new UIActions.ErrorAction(error.message));
      });
  }

  logoutUser() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        this.isLoggedIn.next(false);
      })
      .catch((error) => {
        this.store.dispatch(new UIActions.ErrorAction(error.message));
      });
  }

  checkIsLoggedIn() {
    getAuth().onAuthStateChanged((user: { email: any; uid: any } | null) => {
      this.isCheckPerformed$.next(true);
      if (user) {
        if (user.email) {
          let currentUser: User = {
            email: user.email,
            uid: user.uid,
            role: Role.User,
          };
          // this.store.dispatch(new UserActions.UserLoadedAction(currentUser)) FIXME: check what is this used for
        }

        this.userService.userAtFirebaseAuth = user;
        console.log(user);
        this.isLoggedIn.next(true);
      } else {
        this.isLoggedIn.next(false);
      }
    });
  }
}
