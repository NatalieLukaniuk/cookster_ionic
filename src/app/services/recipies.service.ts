import { computed, inject, Injectable, signal } from '@angular/core';
import { NewRecipy, Recipy } from '../models/recipies.models';
import { RecipiesApiService } from './recipies-api.service';
import { catchError, map, Observable, of, take, tap } from 'rxjs';
import { UiService } from './ui.service';
import { DataMappingService } from './data-mapping.service';
import { FiltersService } from '../filters/services/filters.service';
import { applyFilters } from './filter-helper.utils';
import { UserDataService } from './user-data.service';

@Injectable({
  providedIn: 'root',
})
export class RecipiesService {
  recipiesApi = inject(RecipiesApiService);
  uiService = inject(UiService);
  dataMappingService = inject(DataMappingService);
  filtersService = inject(FiltersService);
  userDataService = inject(UserDataService);

  private recipies = signal<Recipy[]>([]);
  getRecipies = this.recipies.asReadonly();

  $userPreferences = this.userDataService.userPreferences;
  $noShowIds = computed(() => this.$userPreferences()?.noShowRecipies || []);

  recipiesWithFilterEnabled = computed(() => {
    return applyFilters(
      this.recipies(),
      this.filtersService.getCurrentFilters(),
      this.userDataService.userRole(),
      this.userDataService.userEmail() || '',
      this.userDataService.userRecipeCollections(),
      this.userDataService.userPlannedRecipies(),
      this.$noShowIds()
    )
  })
  recipiesWithFilterEnabledCount = computed(() => this.recipiesWithFilterEnabled().length);

  hiddenRecipies = computed(() => this.recipies().filter(recipy => this.$noShowIds().includes(recipy.id)))

  private isRecipiesLoaded = signal(false);
  getIsRecipiesLoaded = this.isRecipiesLoaded.asReadonly();

  private ingredsToAdd = signal<string[]>([]);
  missingIngredients = this.ingredsToAdd.asReadonly();

  loadRecipies(): Observable<Recipy[]> {
    return this.recipiesApi.getRecipies().pipe(
      take(1),
      map((res: Object) => {
        let recipies = Object.entries(res).map(([id, recipy]) => ({ ...recipy, id })).reverse();
        return recipies;
      }),
      tap((recipies: Recipy[]) => {
        this.setRecipies(recipies);
        this.setIsRecipiesLoaded();
      }),
      catchError(err => {
        this.uiService.setError("Не вдалось завантажити рецепти з бази" + err.message);
        return of([])
      })
    )
  }

  private setRecipies(recipies: Recipy[]) {
    this.recipies.set(recipies)
  }

  private setIsRecipiesLoaded() {
    this.isRecipiesLoaded.set(true)
  }

  private onRecipyUpdated(updatedRecipy: Recipy) {
    this.recipies.update((current) => {
      const updatedRecipies = current.map((recipy) => {
        if (recipy.id == updatedRecipy.id) {
          return updatedRecipy;
        } else return recipy;
      });
      return updatedRecipies
    })
  }

  updateRecipy(updatedRecipy: Recipy): Observable<Recipy | null> {
    let updated = {
      ...updatedRecipy,
      calorificValue: this.dataMappingService.countRecipyCalorificValue(
        updatedRecipy.ingrediends
      ),
    };
    this.uiService.setIsLoadingTrue();
    return this.recipiesApi.updateRecipy(updated.id, updated).pipe(
      take(1),
      tap(recipy => {
        this.onRecipyUpdated(recipy);
        this.uiService.setIsLoadingFalse();
        this.uiService.showSuccessMessage(`${recipy.name} оновлено`)
      }),
      catchError(err => {
        this.uiService.setIsLoadingFalse();
        this.uiService.setError(`Не вдалось оновити рецепт: ${err.message}`)
        return of(null)
      })
    )
  }

  addNewRecipy(newRecipy: NewRecipy): Observable<Recipy | null> {
    let updated = {
      ...newRecipy,
      calorificValue: this.dataMappingService.countRecipyCalorificValue(
        newRecipy.ingrediends
      ),
    };

    this.uiService.setIsLoadingTrue();
    return this.recipiesApi.addRecipy(updated).pipe(
      take(1),
      map((resp: { name: string }) => {
        const savedRecipy = {
          ...updated,
          id: resp.name
        }
        return savedRecipy
      }),
      tap(recipy => {
        this.onRecipyAdded(recipy);
        this.uiService.setIsLoadingFalse();
        this.uiService.showSuccessMessage(`${recipy.name} додано в базу`)
      }),
      catchError(err => {
        this.uiService.setIsLoadingFalse();
        this.uiService.setError(`Не вдалось зберегти рецепт: ${err.message}`)
        return of(null)
      })
    )
  }

  private onRecipyAdded(newRecipy: Recipy) {
    this.recipies.update(current => {
      const _array = current.map((recipy) => recipy);
      _array.unshift(newRecipy);
      return _array;
    })
  }

  loadNewIngredients() {
    this.recipiesApi.getIngredientsToAdd().pipe(
      take(1),
      map((res: any) => Object.values(res) as string[])
    ).subscribe(ingreds => this.ingredsToAdd.set(ingreds))
  }

}
