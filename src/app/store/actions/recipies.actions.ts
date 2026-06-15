import { DraftRecipy } from './../../models/recipies.models';
import { Action } from '@ngrx/store';
import { NewRecipy, Product, Recipy } from 'src/app/models/recipies.models';

export enum RecipiesActionTypes {

  ADD_NEW_INGREDIENT = '[INGREDIENT] Add New Ingredient',
  NEW_INGREDIENT_SAVED = '[INGREDIENT] New Ingredient Has Been Saved',
  GET_NEW_INGREDIENTS_ACTION = '[INGREDIENT] Load New Ingredients',
  NEW_INGREDIENTS_LOADED = '[INGREDIENT] New Ingredients Loaded',
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
  constructor(public index: number) {}
}


export class NewIngredientsLoadedAction implements Action {
  readonly type = RecipiesActionTypes.NEW_INGREDIENTS_LOADED;
  constructor(public nameArray: string[]) {}
}
export class LoadNewIngredientsAction implements Action {
  readonly type = RecipiesActionTypes.GET_NEW_INGREDIENTS_ACTION;
  constructor() {}
}
export class NewIngredientSavedAction implements Action { // this is not used anymore
  readonly type = RecipiesActionTypes.NEW_INGREDIENT_SAVED;
  constructor() {}
}
export class AddNewIngredientAction implements Action {
  readonly type = RecipiesActionTypes.ADD_NEW_INGREDIENT;
  constructor(public ingredient: Product) {}
}


export type RecipiesActions =
  | AddNewIngredientAction
  | NewIngredientSavedAction
  | LoadNewIngredientsAction
  | NewIngredientsLoadedAction
  | AddDraftRecipyAction
  | DeleteDraftRecipyAction
  | UpdateDraftRecipyAction;
