import { Action } from "@ngrx/store";
import { Comment } from "src/app/models/comments.models";

export enum CommentsActionTypes {
  ADD_COMMENT = '[COMMENTS] Add Comment',
  COMMENT_ADDED = '[COMMENTS] Comment Added',
  LOAD_COMMENTS = '[COMMENTS] Load Comments',
  COMMENTS_LOADED = '[COMMENTS] Comments Loaded'
}

export class AddCommentAction implements Action {
  readonly type = CommentsActionTypes.ADD_COMMENT;
  constructor(
    public comment: Comment
  ) { }
}

export class CommentAddedAction implements Action {
  readonly type = CommentsActionTypes.COMMENT_ADDED;
  constructor(
    public comment: Comment,
    public commentId: string
  ) { }
}

export class LoadCommentsAction implements Action {
  readonly type = CommentsActionTypes.LOAD_COMMENTS;
  constructor() { }
}

export class CommentsLoadedAction implements Action {
  readonly type = CommentsActionTypes.COMMENTS_LOADED;
  constructor(public comments: Comment[]) { }
}

export type CommentsActions = AddCommentAction | CommentAddedAction | LoadCommentsAction | CommentsLoadedAction;