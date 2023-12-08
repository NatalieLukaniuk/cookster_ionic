import { Injectable } from '@angular/core';
import { Comment } from "src/app/models/comments.models";
import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor() { }

  getCommentsByRecipyId = (recipyId: string, comments: Comment[]) => {
    return comments.filter(comment => comment.recipyId === recipyId)
  }

  buildCommentsTree = (comments: Comment[]) => {
    const tree: Comment[] = [];
    comments.forEach(comment => {
      if (!comment.parentCommentId) {
        tree.push(comment);
      }
    })
    comments.forEach(comment => {
      if (comment.parentCommentId) {
        const parent = tree.find(com => com.id === comment.parentCommentId);
        if (parent && parent.children) {
          parent.children.push(comment)
        } else if (parent && !parent.children) {
          parent.children = [comment]
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
