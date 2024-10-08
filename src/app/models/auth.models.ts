import { ExpenseItem } from '../expenses/expenses-models';
import { DayDetails, Reminder } from './calendar.models';
import { PlannerByDate, ShoppingList, ShoppingListItem } from './planner.models';
import { DraftRecipy, RecipyCollection } from './recipies.models';

export interface User {
  email: string;
  uid: string;
  details?: DayDetails[];
  id?: string;
  shoppingLists?: ShoppingList[];
  savedPreps?: Reminder[];
  img?: string;
  role: Role;
  planner?: PlannerByDate[];
  collections?: RecipyCollection[];
  draftRecipies?: DraftRecipy[];
  preferences?: Preferences;
  family?: FamilyMember[];
}

export enum Role {
  Admin = 'admin',
  User = 'user',
}

export interface Preferences {
  isUseRecommendedPortionSize: boolean;
  defaultPortionSize: number;
  isUsePersonalizedPortionSize: boolean;
  noShowProducts: string[];
  noShowRecipies: string[];
}

export const defaultPrefs: Preferences = {
  isUsePersonalizedPortionSize: false,
  isUseRecommendedPortionSize: false,
  defaultPortionSize: 250,
  noShowProducts: [],
  noShowRecipies: []
}

export interface FamilyMember {
  name: string,
  id: string, // generated with Math.random * 100
  noEat: string[], // product id array
  noLike: string[], // product id array
  like: string[] // product id array,
  portionSizePercentage: number | null;
}

export class NewFamilyMember implements FamilyMember {
  id = Math.round(Math.random() * 100000000).toString();
  like = [];
  noEat: string[] = [];
  noLike: string[] = [];
  portionSizePercentage = null;
  constructor(public name: string) {
    name = this.name;
  }
}

export interface UserMappingItem { cooksterId: string, firebaseId: string, email: string }