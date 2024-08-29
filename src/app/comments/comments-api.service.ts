import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../models/comments.models';

@Injectable({
  providedIn: 'root'
})
export class CommentsApiService {

  url = `https://cookster-12ac8-default-rtdb.firebaseio.com/comments`;
  constructor(private http: HttpClient) {}

  addComment(comment: Comment): Observable<{ name: string }> {
    return this.http.post<{ name: string }>(`${this.url}.json`, comment);
  }

  deleteComment(commentId: string) {
    return this.http.delete(`${this.url}/${commentId}.json`);
  }

  getComments() {
    return this.http.get(`${this.url}.json`);
  }

  updateComment(id: string, data: Comment) {
    return this.http.patch<Comment>(`${this.url}/${id}.json`, data);
  }
}
