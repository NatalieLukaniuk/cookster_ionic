import { MeasuringUnit } from "./recipies.models";

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
      date: Date;
    }[];
  }