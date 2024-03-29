import { Product, Recipy } from 'src/app/models/recipies.models';
import {
  RecipiesActions,
  RecipiesActionTypes,
} from '../actions/recipies.actions';

export interface IRecipiesState {
  allRecipies: Recipy[];
  allProducts: Product[];
  ingredientsToAdd: string[];
}

export const InitialRecipiesState: IRecipiesState = {
  allRecipies: [],
  allProducts: [],
  ingredientsToAdd: [],
};

export function RecipiesReducers(
  state: IRecipiesState = InitialRecipiesState,
  action: RecipiesActions
): IRecipiesState {
  switch (action.type) {
    case RecipiesActionTypes.RECIPIES_LOADED: {
      return {
        ...state,
        allRecipies: action.recipies,
      };
    }

    case RecipiesActionTypes.PRODUCTS_LOADED: {
      return {
        ...state,
        allProducts: action.products,
      };
    }

    case RecipiesActionTypes.ADD_RECIPY_SUCCESS: {
      return {
        ...state,
        allRecipies: addRecipy(state.allRecipies, action.recipy),
      };
    }

    case RecipiesActionTypes.UPDATE_RECIPY_SUCCESS: {
      return {
        ...state,
        allRecipies: updateRecipy(state.allRecipies, action.recipy),
      };
    }

    case RecipiesActionTypes.NEW_INGREDIENTS_LOADED: {
      return {
        ...state,
        ingredientsToAdd: action.nameArray,
      };
    }

    case RecipiesActionTypes.ADD_NEW_INGREDIENT: {
      return {
        ...state,
        allProducts: addProduct(state.allProducts, action.ingredient),
      };
    }
    default:
      return { ...state };
  }
}

export function addRecipy(
  recipiesArray: Recipy[],
  newRecipy: Recipy
): Recipy[] {
  let _array = recipiesArray.map((recipy) => recipy);
  _array.unshift(newRecipy);
  return _array;
}

export function updateRecipy(
  recipiesArray: Recipy[],
  updatedRecipy: Recipy
): Recipy[] {
  let _array = recipiesArray.map((recipy) => {
    if (recipy.id == updatedRecipy.id) {
      return updatedRecipy;
    } else return recipy;
  });
  return _array;
}

export function addProduct(
  allProducts: Product[],
  ingredient: Product
): Product[] {
  let _array = allProducts.map((product) => product);
  _array.unshift(ingredient);
  return _array;
}
