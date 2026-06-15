import { Product, Recipy } from 'src/app/models/recipies.models';
import {
  RecipiesActions,
  RecipiesActionTypes,
} from '../actions/recipies.actions';

export interface IRecipiesState {
  ingredientsToAdd: string[];
}

export const InitialRecipiesState: IRecipiesState = {
  ingredientsToAdd: [],
};

export function RecipiesReducers(
  state: IRecipiesState = InitialRecipiesState,
  action: RecipiesActions
): IRecipiesState {
  switch (action.type) {
    
    case RecipiesActionTypes.NEW_INGREDIENTS_LOADED: {
      return {
        ...state,
        ingredientsToAdd: action.nameArray,
      };
    }    
    default:
      return { ...state };
  }
}


