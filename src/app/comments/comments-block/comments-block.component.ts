import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, map, tap } from 'rxjs';
import { User } from 'src/app/models/auth.models';
import { IAppState } from 'src/app/store/reducers';
import { getComments } from 'src/app/store/selectors/comments.selectors';
import { Comment } from 'src/app/models/comments.models';
import { CommentsService } from '../comments.service';
import { AddCommentAction } from 'src/app/store/actions/comments.actions';

@Component({
  selector: 'app-comments-block',
  templateUrl: './comments-block.component.html',
  styleUrls: ['./comments-block.component.scss']
})
export class CommentsBlockComponent implements OnInit {
  // TODO: functionality when the user is not logged in
  @Input() recipyId: string | undefined;
  @Input() currentUser!: User | null | undefined;

  text = '';

  comments$!: Observable<Comment[]>;

  modalId = '';

  replyTo: string | null = null;
  totalComments: number = 0;

  isModalOpen = false;

  constructor(private store: Store<IAppState>, private commentsService: CommentsService) {

  }
  ngOnInit(): void {
    if (!!this.recipyId) {
      this.modalId = 'comments' + '-' + this.recipyId;
      this.comments$ = this.store.pipe(select(getComments), map(comments => {
        if (comments) {
          const filtered = this.commentsService.getCommentsByRecipyId(this.recipyId!, comments);
          this.totalComments = filtered.length;
          const tree = this.commentsService.buildCommentsTree(filtered)
          return tree
        }
        else {
          return []
        }
      }));
    }
  }

  saveComment() {
    if (this.currentUser && this.recipyId) {
      const commentToSave: Comment = {
        author: this.currentUser?.email,
        addedOn: new Date(),
        text: this.text,
        recipyId: this.recipyId
      }
      if (this.replyTo) {
        commentToSave.parentCommentId = this.replyTo;
      }
      this.store.dispatch(new AddCommentAction(commentToSave));
      this.replyTo = null;
    }

  }

  @ViewChild('textarea') textarea: any

  onModalPresented() {
    this.textarea?.setFocus()
  }


  onReplyTo(id: string) {
    this.replyTo = id;
    this.textarea?.setFocus()
  }

  cancelReplyTo() {
    this.replyTo = null;
    this.textarea?.setFocus()
  }

  isReply(commentId: string | undefined): boolean {
    return !!this.replyTo && !!commentId && commentId === this.replyTo
  }

  onLongPress(commentId: string | undefined) {
    //TODO: functionality to select and delete comments on long press
  }

  click() {
    this.isModalOpen = true;
  }
}
