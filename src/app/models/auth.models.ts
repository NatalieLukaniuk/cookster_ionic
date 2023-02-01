import { DayDetails, Suggestion } from './calendar.models';
import { PlannerByDate, ShoppingListItem } from './planner.models';
import { RecipyCollection } from './recipies.models';

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
  // scenarios?: SuggestionList[];
}

export enum Role {
  Admin = 'admin',
  User = 'user',
}
