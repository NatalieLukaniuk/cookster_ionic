import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  url = `https://cookster-12ac8-default-rtdb.firebaseio.com/users`;
  constructor(private http: HttpClient) {}

  addUser(user: Partial<User>) {
    return this.http.post(`${this.url}.json`, user);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}.json`);
  }

  updateUser(id: string, data: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.url}/${id}.json`, data);
  }
}
