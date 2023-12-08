import { createSelector } from "@ngrx/store";
import { IAppState } from "../reducers";



const getCommentsState = (state: IAppState) => state.comments;

export const getComments = createSelector(
    getCommentsState,
    (state) => state.comments
);


