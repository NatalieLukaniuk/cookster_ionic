import { Component, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { tap } from 'rxjs';
import { User } from 'src/app/models/auth.models';
import { IAppState } from 'src/app/store/reducers';
import { getComments } from 'src/app/store/selectors/comments.selectors';
import { Comment } from 'src/app/models/comments.models';

@Component({
  selector: 'app-comments-block',
  templateUrl: './comments-block.component.html',
  styleUrls: ['./comments-block.component.scss']
})
export class CommentsBlockComponent {
  @Input() recipyId: string | undefined;
  @Input() currentUser!: User | null;

  text = '';

  comments$ = this.store.pipe(select(getComments), tap(res => {console.log(res)}));

  constructor(private store: Store<IAppState>,){}

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
}
