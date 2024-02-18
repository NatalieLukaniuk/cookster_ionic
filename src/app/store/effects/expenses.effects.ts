import { DeleteExpenseAction, ExpenseAddedAction, ExpenseDeletedAction } from './../actions/expenses.actions';
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { IAppState } from "../reducers";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AddExpenseAction, ExpensesActionTypes } from "../actions/expenses.actions";
import { ExpensesApiService } from "src/app/services/expenses-api.service";
import { switchMap, map } from 'rxjs';

@Injectable()
export class ExpensesEffects {
    constructor(private actions$: Actions, private store: Store<IAppState>, private apiService: ExpensesApiService) { }
    addExpense$ = createEffect(() => this.actions$.pipe(
        ofType(ExpensesActionTypes.ADD_EXPENSE),
        switchMap((action: AddExpenseAction) => this.apiService.addExpense(action.expense).pipe(
            map(res => new ExpenseAddedAction(res))
        ))
    ))

    deleteExpense$ = createEffect(() => this.actions$.pipe(
        ofType(ExpensesActionTypes.DELETE_EXPENSE),
        switchMap((action: DeleteExpenseAction) => this.apiService.removeExpense(action.expense).pipe(
            map(res => new ExpenseDeletedAction(res))
        ))
    ))
    
}