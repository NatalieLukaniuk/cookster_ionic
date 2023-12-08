import { Component, Input } from '@angular/core';
import { Comment } from 'src/app/models/comments.models';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {
  mockComment: Comment = {
    author: 'test@gmail.com',
    text: 'test comment to check how this looks',
    addedOn: new Date(),
    id: 'ff',
    recipyId: 'j'
  }
  
  @Input() comment: Comment | undefined = this.mockComment;


}
