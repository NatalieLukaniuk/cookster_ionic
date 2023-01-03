import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewRecipy, Recipy } from '../models/recipies.models';

@Injectable({
  providedIn: 'root',
})
export class RecipiesApiService {
  url = `https://cookster-12ac8-default-rtdb.firebaseio.com/recipies`;
  ingredsToAddUrl = `https://cookster-12ac8-default-rtdb.firebaseio.com/ingredientsToAdd`;

  constructor(private http: HttpClient) {}

  addRecipy(recipy: NewRecipy): Observable<{name: string}> {
    return this.http.post<{name: string}>(`${this.url}.json`, recipy);
  }

  updateRecipy(id: string, data: any){
    return this.http.patch<Recipy>(`${this.url}/${id}.json`, data);
  }

  getRecipies(): Observable<Recipy[]> {
    return this.http.get<Recipy[]>(`${this.url}.json`);
  }

  getRecipyById(id: string) {
    return this.http.get<Recipy>(`${this.url}/${id}.json`);
  }

  deleteRecipy(id: string) {
    return this.http.delete<Recipy>(`${this.url}/${id}.json`);
  }

  saveToIngredientsToAddArray(name: string){
    return this.http.post<any>(`${this.ingredsToAddUrl}.json`, JSON.stringify(name));
  }

  getIngredientsToAdd():Observable<any>{
    return this.http.get<any>(`${this.ingredsToAddUrl}.json`);
  }
}
