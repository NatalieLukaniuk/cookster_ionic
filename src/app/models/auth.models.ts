import { DayDetails, Suggestion } from './calendar.models';
import { PlannerByDate, ShoppingListItem } from './planner.models';
import { DraftRecipy, RecipyCollection } from './recipies.models';

export interface User {
  email: string;
  uid: string;
  details?: DayDetails[];
  id?: string;
  shoppingLists?: ShoppingListItem[]; // FIXME: this is probably no longer used
  savedPreps?: Suggestion[];
  img?: string;
  role: Role;
  planner?: PlannerByDate[];
  collections?: RecipyCollection[];
  draftRecipies?: DraftRecipy[];
  // scenarios?: SuggestionList[];
}

export enum Role {
  Admin = 'admin',
  User = 'user',
}
