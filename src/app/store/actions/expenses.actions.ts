import { Action } from "@ngrx/store";
import { ExpenseItem } from "src/app/expenses/expenses-models";

export enum ExpensesActionTypes {
    EXPENSES_LOADED = '[EXPENSES] Expenses loaded',
    DELETE_EXPENSE = '[EXPENSES] Delete expense', // no effect
    ADD_EXPENSE = '[EXPENSES] Add expense', // no effect
    EXPENSE_DELETED = '[EXPENSES] Expense Deleted',
    EXPENSE_ADDED = '[EXPENSES] Expense Added'
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
  export class ExpenseDeletedAction implements Action {
    readonly type = ExpensesActionTypes.EXPENSE_DELETED;
    constructor(
        public expenses: ExpenseItem[]
    ) { }
  }

  export class ExpenseAddedAction implements Action {
    readonly type = ExpensesActionTypes.EXPENSE_ADDED;
    constructor(
        public expenses: ExpenseItem[]
    ) { }
  }

  export type ExpensesActions = ExpensesLoadedAction | DeleteExpenseAction | AddExpenseAction | ExpenseAddedAction | ExpenseDeletedAction;