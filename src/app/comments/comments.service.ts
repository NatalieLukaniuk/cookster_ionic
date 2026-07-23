import { inject, Injectable, signal } from '@angular/core';
import { Comment } from "src/app/models/comments.models";
import * as moment from "moment";
import { CommentsApiService } from './comments-api.service';
import { map, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  commentsApiService = inject(CommentsApiService)

  private comments = signal<Comment[] | null>(null);
  getComments = this.comments.asReadonly();

  loadComments() {
    this.commentsApiService.getComments().pipe(
      take(1),
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
        return comments
      })
    ).subscribe(
      res => this.comments.set(res)
    )
  }

  deleteComment(commentId: string) {
    return this.commentsApiService.deleteComment(commentId).pipe(take(1),
      tap(() => this.comments.update(current => {
        if (!current) {
          return current
        } else {
          return current.filter(comment => comment.id !== commentId)
        }
      })))
  }

  addComment(commentToAdd: Comment) {
    return this.commentsApiService.addComment(commentToAdd).pipe(
      take(1),
      tap((res) => this.comments.update(current => {
        if (!current) {
          return current
        } else {
          return current.concat({...commentToAdd, id: res.name})
        }
      }))
    )
  }

  getCommentsByRecipyId = (recipyId: string, comments: Comment[]) => {
    return comments.filter(comment => comment.recipyId === recipyId)
  }

  buildCommentsTree = (originalComments: Comment[]) => {
    let comments = originalComments.map(i => i);
    const tree: Comment[] = [];
    comments.forEach(comment => {
      if (!comment.parentCommentId) {
        tree.push({ ...comment, children: [] });
      }
    })
    comments.forEach(comment => {
      if (comment.parentCommentId) {
        let parent = tree.find(com => com.id === comment.parentCommentId);
        const isParentExists = originalComments.find(com => com.id === comment.parentCommentId);

        if (!parent && isParentExists) {
          tree.forEach(firstLvlvElement => {
            let tryFind = firstLvlvElement.children?.find(com => com.id === comment.parentCommentId);
            if (tryFind) {
              parent = firstLvlvElement;
            }
          })
        }

        if (parent) {
          parent.children?.push(comment)
        } else {
          tree.push(comment)
        }
      }
    })
    tree.sort((a, b) => this.sortCommentsByDate(a, b));
    tree.forEach(el => {
      if (el.children && el.children.length > 1) {
        el.children.sort((a, b) => this.sortCommentsByDate(a, b))
      }
    })
    return tree;
  }

  sortCommentsByDate = (a: Comment, b: Comment) => {
    if (moment(a.addedOn).clone().isAfter(moment(b.addedOn).clone())) {
      return 1
    } else {
      return -1
    }
  }
}
