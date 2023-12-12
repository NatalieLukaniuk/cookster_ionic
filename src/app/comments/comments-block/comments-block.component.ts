import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, map, tap } from 'rxjs';
import { User } from 'src/app/models/auth.models';
import { IAppState } from 'src/app/store/reducers';
import { getComments } from 'src/app/store/selectors/comments.selectors';
import { Comment } from 'src/app/models/comments.models';
import { CommentsService } from '../comments.service';

@Component({
  selector: 'app-comments-block',
  templateUrl: './comments-block.component.html',
  styleUrls: ['./comments-block.component.scss']
})
export class CommentsBlockComponent implements OnInit {
  @Input() recipyId: string | undefined;
  @Input() currentUser!: User | null;

  text = '';

  comments$!: Observable<Comment[]>;

  modalId = ''

  constructor(private store: Store<IAppState>, private commentsService: CommentsService) {

  }
  ngOnInit(): void {
    if (!!this.recipyId) {
      this.modalId = 'comments' + '-' + this.recipyId;
      this.comments$ = this.store.pipe(select(getComments), map(comments => {
        if (comments) {
          // const filtered = this.commentsService.getCommentsByRecipyId(this.recipyId!, comments);
          // const tree = this.commentsService.buildCommentsTree(filtered)
          const tree = this.commentsService.buildCommentsTree(comments)
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
        recipyId: this.recipyId,
        id: crypto.randomUUID()
      }
      console.log(commentToSave)
    }

  }

  @ViewChild('textarea') textarea: any

  onModalPresented() {
    this.textarea?.setFocus()
  }
}
