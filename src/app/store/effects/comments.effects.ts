import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { IAppState } from "../reducers";
import { AddCommentAction, CommentAddedAction, CommentsActionTypes, CommentsLoadedAction, LoadCommentsAction } from "../actions/comments.actions";
import { map, switchMap } from "rxjs";
import { CommentsApiService } from "src/app/comments/comments-api.service";
import { Comment } from "src/app/models/comments.models";

@Injectable()
export class CommentsEffects {
    constructor(private actions$: Actions, private store: Store<IAppState>, private commentsService: CommentsApiService) { }
    addComment$ = createEffect(() => this.actions$.pipe(
        ofType(CommentsActionTypes.ADD_COMMENT),
        switchMap((action: AddCommentAction) => this.commentsService.addComment(action.comment).pipe(
            map(res => new CommentAddedAction(action.comment, res.name))
        ))
    ))

    loadComments$ = createEffect(() => this.actions$.pipe(
        ofType(CommentsActionTypes.LOAD_COMMENTS),
        switchMap((action: LoadCommentsAction) => this.commentsService.getComments().pipe(
            map(res => {
                let comments: Comment[] = [];
                if (res) {
                    Object.entries(res).forEach(([id, comment]) => {
                        comments.push({
                            ...comment,
                            id
                        })
                    })
                }                
                return new CommentsLoadedAction(comments)
            })
        ))
    ))
}