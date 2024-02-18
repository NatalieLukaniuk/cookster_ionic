import { Action } from "@ngrx/store";
import { ExpenseItem } from "src/app/expenses/expenses-models";

export enum ExpensesActionTypes {
    EXPENSES_LOADED = '[EXPENSES] Expenses loaded',
    DELETE_EXPENSE = '[EXPENSES] Delete expenses', // no effect
    ADD_EXPENSE = '[EXPENSES] Add expense', // no effect
  }

  export class ExpensesLoadedAction implements Action {
    readonly type = ExpensesActionTypes.EXPENSES_LOADED;
    constructor(
      public expenses: ExpenseItem[]
    ) { }
  }

  export class DeleteExpenseAction implements Action {
    readonly type = ExpensesActionTypes.DELETE_EXPENSE;
    constructor(
      public expense: ExpenseItem
    ) { }
  }

  export class AddExpenseAction implements Action {
    readonly type = ExpensesActionTypes.ADD_EXPENSE;
    constructor(
      public expense: ExpenseItem
    ) { }
  }

  export type ExpensesActions = ExpensesLoadedAction | DeleteExpenseAction | AddExpenseAction;