import { Component, computed, inject, input, Input, OnDestroy,  ViewChild } from '@angular/core';

import { Subject } from 'rxjs';
import { Comment } from 'src/app/models/comments.models';
import { CommentsService } from '../comments.service';
import { DialogsService } from 'src/app/services/dialogs.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-comments-block',
  templateUrl: './comments-block.component.html',
  styleUrls: ['./comments-block.component.scss']
})
export class CommentsBlockComponent implements OnDestroy {
  userDataService = inject(UserDataService);
  // TODO: functionality when the user is not logged in
  recipyId = input.required<string>();
  @Input() recipyName: string = '';

  $isUserLoggedIn = this.userDataService.isUserLoggedIn;
  $userEmail = this.userDataService.userEmail;

  text = '';

  $allComments = this.commentsService.getComments;

  $commentsForRecipy = computed(() => {
    const allComments = this.$allComments()
    if (allComments) {
      return this.commentsService.getCommentsByRecipyId(this.recipyId(), allComments)
    } else return []
  })

  $totalComments = computed(() => this.$commentsForRecipy().length)
  $commentsTree = computed(() => {
    return this.commentsService.buildCommentsTree(this.$commentsForRecipy())
  })

  modalId = computed(() => 'comments' + '-' + this.recipyId());

  replyTo: string | null = null;
  selectedComment: string | null = null;

  totalComments: number = 0;

  isModalOpen = false;
  destroyed$ = new Subject<void>()

  constructor(private commentsService: CommentsService, private dialog: DialogsService) {

  }
  ngOnDestroy(): void {
    this.destroyed$.next();
  }


  saveComment() {
    if (this.$isUserLoggedIn() && this.recipyId) {
      const commentToSave: Comment = {
        author: this.$userEmail()!,
        addedOn: new Date(),
        text: this.text,
        recipyId: this.recipyId()
      }
      if (this.replyTo) {
        commentToSave.parentCommentId = this.replyTo;
      }
      this.commentsService.addComment(commentToSave).subscribe(
        //TODO
      )
      this.replyTo = null;
      this.text = '';
    }

  }

  @ViewChild('textarea') textarea: any

  onModalPresented() {
    this.textarea?.setFocus()
  }


  onReplyTo(id: string) {
    this.cancelSelection()
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

  isSelected(commentId: string | undefined): boolean {
    return !!this.selectedComment && !!commentId && commentId === this.selectedComment
  }

  onLongPress(commentId: string | undefined, author: string | undefined) {
    if (commentId && !this.replyTo && author && author === this.$userEmail()) {
      this.selectedComment = commentId
    }
  }

  cancelSelection() {
    this.selectedComment = null;
  }

  setOpen(value: boolean) {
    this.isModalOpen = value;
  }

  deleteComment(commentId: string | undefined) {
    if (commentId) {
      this.dialog
        .openConfirmationDialog(
          `Видалити коментар?`,
          'Ця дія незворотня'
        )
        .then((res) => {
          if (res.role === 'confirm') {
            this.commentsService.deleteComment(commentId).subscribe(
              //TODO
            )
          } else {
            this.selectedComment = null;
          }
        });
    }
  }

  get commentsText() {
    switch (this.totalComments) {
      case 1: return 'коментар';
      case 2:
      case 3:
      case 4: return 'коментарі';
      default: return 'коментарів';
    }
  }
}
