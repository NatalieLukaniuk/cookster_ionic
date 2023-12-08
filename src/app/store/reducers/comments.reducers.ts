import { CommentsActionTypes, CommentsActions } from "../actions/comments.actions";
import { Comment } from "src/app/models/comments.models";

export interface CommentsState {
    comments: Comment[] | null
}

export const InitialCommentsState: CommentsState = {
    comments: null
}

export function CommentsReducers(
    state: CommentsState = InitialCommentsState,
    action: CommentsActions
  ): CommentsState {
    switch (action.type) {
        case CommentsActionTypes.COMMENT_ADDED: {
            return {
              ...state,
            };
          }

          case CommentsActionTypes.COMMENTS_LOADED: {
            return {
              ...state,
              comments: action.comments
            };
          }
        default:
      return state;
    }
  }