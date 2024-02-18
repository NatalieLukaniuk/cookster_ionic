import { ExpenseItem } from "src/app/expenses/expenses-models";
import { ExpensesActionTypes, ExpensesActions } from "../actions/expenses.actions";

export interface ExpensesState {
    expenses: ExpenseItem[] | null
  }
  
  export const InitialExpensesState: ExpensesState = {
    expenses: null
  }

  export function ExpensesReducers(
    state: ExpensesState = InitialExpensesState,
    action: ExpensesActions
  ): ExpensesState {
    switch (action.type) {
      case ExpensesActionTypes.EXPENSES_LOADED: {
        return {
          ...state,
          expenses: action.expenses
        };
      }
  
      
      default:
        return state;
    }
  }