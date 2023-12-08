import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { IAppState } from "../reducers";
import { AddCommentAction, CommentAddedAction, CommentsActionTypes, CommentsLoadedAction, LoadCommentsAction } from "../actions/comments.actions";
import { map, switchMap } from "rxjs";
import { CommentsApiService } from "src/app/comments/comments-api.service";

@Injectable()
export class CommentsEffects {
    constructor(private actions$: Actions, private store: Store<IAppState>, private commentsService: CommentsApiService) { }
    addComment$ = createEffect(() => this.actions$.pipe(
        ofType(CommentsActionTypes.ADD_COMMENT),
        switchMap((action: AddCommentAction) => this.commentsService.addComment(action.comment).pipe(
            map(res => new CommentAddedAction(action.comment, res.id))
        ))
    ))

    loadComments$ = createEffect(() => this.actions$.pipe(
        ofType(CommentsActionTypes.LOAD_COMMENTS),
        switchMap((action: LoadCommentsAction) => this.commentsService.getComments().pipe(
            map(res => new CommentsLoadedAction([
                {
                    author: 'test@gmail.com',
                    text: 'test comment to check how this looks',
                    addedOn: new Date(),
                    id: 'ff',
                    recipyId: 'j'
                }
            ]))
        ))
    ))
}