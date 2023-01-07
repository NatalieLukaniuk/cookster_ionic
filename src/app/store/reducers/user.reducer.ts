import { User } from 'src/app/models/auth.models';
import { UserActions, UserActionTypes } from '../actions/user.actions';

export interface IUserState {
  currentUser: User | null;
}

export const InitialUserState: IUserState = {
  currentUser: null,
};

export function UserReducers(
  state: IUserState = InitialUserState,
  action: UserActions
): IUserState {
  switch (action.type) {
    case UserActionTypes.USER_LOADED: {
      return {
        ...state,
        currentUser: action.user,
      };
    }

    case UserActionTypes.USER_LOGGED_OUT: {
      return {
        ...state,
        currentUser: null,
      };
    }
    
    case UserActionTypes.UPDATE_USER_SUCCESSFUL: {
      return {
        ...state,
        currentUser: action.response,
      };
    }
    default:
      return { ...state };
  }
}
