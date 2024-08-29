import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Comment } from 'src/app/models/comments.models';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {
  @Output() onButtonClicked = new EventEmitter<string>();

  @Input() comment: Comment | undefined;

  @Input() buttonText: string = ''


  buttonClicked() {
    this.onButtonClicked.emit(this.comment?.id);
  }

  get isSecondaryComment(){
    return !!this.comment?.parentCommentId
  }
}
