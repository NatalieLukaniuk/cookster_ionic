import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  filteredRecipies: number = 0;
  constructor() {}
}
