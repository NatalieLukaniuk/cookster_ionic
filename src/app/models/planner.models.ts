import { SuggestionList } from './calendar.models';
import { MeasuringUnit } from './recipies.models';

export interface Planner {
  id: string;
  startDate: string;
  endDate: string;
  shoppingLists: ShoppingList[];
  preps: SuggestionList[];
  isShoppingListActive: boolean;
}

export class PlannerByDate implements Planner {
  id: string;
  startDate: string;
  endDate: string;
  shoppingLists: ShoppingList[];
  preps: SuggestionList[];
  isShoppingListActive: boolean;
  constructor(startDate: string, endDate: string) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.id = startDate + '_' + endDate;
    this.shoppingLists = [];
    this.preps = [];
    this.isShoppingListActive = false;
  }
}

export interface ShoppingList {
  name: string;
  isExpanded: boolean;
  items: ShoppingListItem[];
}

export interface ShoppingListItem {
  title: string;
  amount: string;
  comment?: string;
  editMode: boolean;
  completed: boolean;
}

export interface SLItem {
  total: number;
  name: string;
  id: string;
  unit: MeasuringUnit;
  items: {
    product: string;
    amount: string;
    defaultUnit: number;
    recipyId: string;
    day: { day: string; meal: string };
  }[];
}
