import { FamilyMember, Preferences, User } from 'src/app/models/auth.models';
import { UserActions, UserActionTypes } from '../actions/user.actions';
import * as _ from 'lodash';
import { mockPlannedRecipies } from 'src/app/calendar/calendar.models';

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
    case UserActionTypes.UPDATE_FAMILY_SUCCESSFUL: {
      return {
        ...state,
        currentUser: updateUserOnFamilyUpdated(action.family, state.currentUser)
      }
    }

    case UserActionTypes.UPDATE_PREFERENCES_SUCCESSFUL: {
      return {
        ...state,
        currentUser: updateUserOnPreferencesUpdated(action.preferences, state.currentUser)
      }
    }

    case UserActionTypes.USER_LOADED: {
      return {
        ...state,
        currentUser: {...action.user},
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

export const updateUserOnFamilyUpdated = (family: FamilyMember[], currentUser: User | null) => {
  if (currentUser) {
    let updatedUser = _.cloneDeep(currentUser);
    updatedUser.family = family;
    return updatedUser;
  } else {
    return null
  }
}

export const updateUserOnPreferencesUpdated = (preferences: Preferences, currentUser: User | null) => {
  if (currentUser) {
    let updatedUser = _.cloneDeep(currentUser);
    updatedUser.preferences = preferences;
    return updatedUser;
  } else {
    return null
  }
}