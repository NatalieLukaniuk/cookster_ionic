import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/recipies.models';

@Injectable({
  providedIn: 'root',
})
export class ProductsApiService {
  url = `https://cookster-12ac8-default-rtdb.firebaseio.com/products`;
  constructor(private http: HttpClient) {}

  addProduct(product: any): Observable<{ name: string }> {
    return this.http.post<{ name: string }>(`${this.url}.json`, product);
  }

  deleteProduct(product: Product) {
    return this.http.delete(`${this.url}/${product.id}.json`);
  }

  getProducts() {
    return this.http.get(`${this.url}.json`);
  }

  updateProduct(id: string, data: Product) {
    return this.http.patch<Product>(`${this.url}/${id}.json`, data);
  }
}
