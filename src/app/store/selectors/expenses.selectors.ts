import { createSelector } from "@ngrx/store";
import { IAppState } from "../reducers";

const getExpensesState = (state: IAppState) => state.expenses;

export const getExpenses = createSelector(
    getExpensesState,
    (state) => state.expenses
);