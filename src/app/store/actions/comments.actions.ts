import { Action } from "@ngrx/store";
import { Comment } from "src/app/models/comments.models";

export enum CommentsActionTypes {
  ADD_COMMENT = '[COMMENTS] Add Comment',
  COMMENT_ADDED = '[COMMENTS] Comment Added',
  LOAD_COMMENTS = '[COMMENTS] Load Comments',
  COMMENTS_LOADED = '[COMMENTS] Comments Loaded',
  DELETE_COMMENT = '[COMMENTS] Delete Comment',
  COMMENT_DELETED = '[COMMENTS] Deleted Comment'
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

export class DeleteCommentAction implements Action {
  readonly type = CommentsActionTypes.DELETE_COMMENT;
  constructor(
    public commentId: string
  ) { }
}

export class CommentDeletedAction implements Action {
  readonly type = CommentsActionTypes.COMMENT_DELETED;
  constructor(
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

export type CommentsActions = AddCommentAction | CommentAddedAction | LoadCommentsAction | CommentsLoadedAction | DeleteCommentAction | CommentDeletedAction;