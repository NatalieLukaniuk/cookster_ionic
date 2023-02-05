import { DraftRecipy } from './../../models/recipies.models';
import { Action } from '@ngrx/store';
import { NewRecipy, Product, Recipy } from 'src/app/models/recipies.models';

export enum RecipiesActionTypes {
  RECIPIES_LOADED = '[RECIPIES] Recipies Loaded',
  GET_RECIPIES = '[RECIPIES] Get Recipies',
  GET_PRODUCTS = '[PRODUCTS] Get Products',
  PRODUCTS_LOADED = '[PRODUCTS] Products Loaded',
  ADD_RECIPY = '[RECIPIES] Add New Recipy',
  ADD_RECIPY_SUCCESS = '[RECIPIES] New Recipy Has Been Added',
  UPDATE_RECIPY = '[RECIPIES] Update Recipy',
  UPDATE_RECIPY_SUCCESS = '[RECIPIES] Recipy Has Been Updated',
  ADD_NEW_INGREDIENT = '[INGREDIENT] Add New Ingredient',
  NEW_INGREDIENT_SAVED = '[INGREDIENT] New Ingredient Has Been Saved',
  GET_NEW_INGREDIENTS_ACTION = '[INGREDIENT] Load New Ingredients',
  NEW_INGREDIENTS_LOADED = '[INGREDIENT] New Ingredients Loaded',
  UPDATE_PRODUCT = '[RECIPIES] Update Ingredient',
  UPDATE_PRODUCT_SUCCESS = '[RECIPIES] Ingredient Has Been Updated',
  ADD_DRAFT_RECIPY = '[RECIPIES] Add Draft Recipy',
  DELETE_DRAFT_RECIPY = '[RECIPIES] Delete Draft Recipy',
  UPDATE_DRAFT_RECIPY = '[RECIPIES] Update Draft Recipy',
}

export class UpdateDraftRecipyAction implements Action {
  readonly type = RecipiesActionTypes.UPDATE_DRAFT_RECIPY;
  constructor(public recipy: DraftRecipy, public order: number) {}
}

export class AddDraftRecipyAction implements Action {
  readonly type = RecipiesActionTypes.ADD_DRAFT_RECIPY;
  constructor(public recipy: DraftRecipy) {}
}

export class DeleteDraftRecipyAction implements Action {
  readonly type = RecipiesActionTypes.DELETE_DRAFT_RECIPY;
  constructor(public recipy: DraftRecipy) {}
}

export class GetProductsAction implements Action {
  readonly type = RecipiesActionTypes.GET_PRODUCTS;
  constructor() {}
}

export class ProductsLoadedAction implements Action {
  readonly type = RecipiesActionTypes.PRODUCTS_LOADED;
  constructor(public products: Product[]) {}
}

export class UpdateProductAction implements Action {
  readonly type = RecipiesActionTypes.UPDATE_PRODUCT;
  constructor(public product: Product) {}
}

export class UpdateProductSuccessAction implements Action {
  readonly type = RecipiesActionTypes.UPDATE_PRODUCT_SUCCESS;
  constructor(public product: Product) {}
}

export class NewIngredientsLoadedAction implements Action {
  readonly type = RecipiesActionTypes.NEW_INGREDIENTS_LOADED;
  constructor(public nameArray: string[]) {}
}
export class LoadNewIngredientsAction implements Action {
  readonly type = RecipiesActionTypes.GET_NEW_INGREDIENTS_ACTION;
  constructor() {}
}
export class NewIngredientSavedAction implements Action {
  readonly type = RecipiesActionTypes.NEW_INGREDIENT_SAVED;
  constructor() {}
}
export class AddNewIngredientAction implements Action {
  readonly type = RecipiesActionTypes.ADD_NEW_INGREDIENT;
  constructor(public ingredientName: string) {}
}
export class UpdateRecipyAction implements Action {
  readonly type = RecipiesActionTypes.UPDATE_RECIPY;
  constructor(public recipy: Recipy) {}
}

export class UpdateRecipySuccessAction implements Action {
  readonly type = RecipiesActionTypes.UPDATE_RECIPY_SUCCESS;
  constructor(public recipy: Recipy) {}
}

export class AddNewRecipyAction implements Action {
  readonly type = RecipiesActionTypes.ADD_RECIPY;
  constructor(public recipy: NewRecipy) {}
}

export class AddNewRecipySuccessAction implements Action {
  readonly type = RecipiesActionTypes.ADD_RECIPY_SUCCESS;
  constructor(public recipy: Recipy) {}
}

export class GetRecipiesAction implements Action {
  readonly type = RecipiesActionTypes.GET_RECIPIES;
  constructor() {}
}

export class RecipiesLoadedAction implements Action {
  readonly type = RecipiesActionTypes.RECIPIES_LOADED;
  constructor(public recipies: Recipy[]) {}
}

export type RecipiesActions =
  | GetRecipiesAction
  | RecipiesLoadedAction
  | AddNewRecipyAction
  | AddNewRecipySuccessAction
  | UpdateRecipyAction
  | UpdateRecipySuccessAction
  | AddNewIngredientAction
  | NewIngredientSavedAction
  | LoadNewIngredientsAction
  | NewIngredientsLoadedAction
  | UpdateProductAction
  | UpdateProductSuccessAction
  | GetProductsAction
  | ProductsLoadedAction
  | AddDraftRecipyAction
  | DeleteDraftRecipyAction
  | UpdateDraftRecipyAction;
