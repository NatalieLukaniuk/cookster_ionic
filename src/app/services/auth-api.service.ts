import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserMappingItem } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  url = `https://cookster-12ac8-default-rtdb.firebaseio.com/users`;
  allUsers =  'https://cookster-12ac8-default-rtdb.firebaseio.com/user-mapping.json'
  constructor(private http: HttpClient) {}

  addUser(user: Partial<User>) {
    return this.http.post<{name: string}>(`${this.url}.json`, user);
  }

  updateUser(id: string, data: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.url}/${id}.json`, data);
  }

  getAllUsers(){
    return this.http.get<UserMappingItem[]>(this.allUsers);
  }

  addNewUser(users: UserMappingItem[]){
    return this.http.put<UserMappingItem[]>(this.allUsers, users);
  }

  getUser(cooksterId: string){
    return this.http.get<User>(`${this.url}/${cooksterId}.json`);
  }
}
