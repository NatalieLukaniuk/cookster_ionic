import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { FamilyMember, Preferences } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  baseUrl = `https://cookster-12ac8-default-rtdb.firebaseio.com/users`;

  constructor(private http: HttpClient, private userService: UserService) {}

  get userId(){
    return this.userService.currentUserId;
  }

  getUserUrl(){
    return `${this.baseUrl}/${this.userId}.json`;
  }

  getPreferencesUrl(){
    return `${this.baseUrl}/${this.userId}/preferences.json`;
  }

  updatePreferences(data: Preferences){
    return this.http.patch<Preferences>(this.getPreferencesUrl(), data);
  }
}
