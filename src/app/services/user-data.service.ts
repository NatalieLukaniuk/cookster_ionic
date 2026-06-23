import { computed, inject, Injectable, signal } from '@angular/core';
import { defaultPrefs, FamilyMember, Preferences, Role, User } from '../models/auth.models';
import { AuthApiService } from './auth-api.service';
import { catchError, finalize, Observable, of, take, tap, filter } from 'rxjs';
import { UiService } from './ui.service';
import { ShoppingList } from '../models/shopping-list.models';
import { DraftRecipy, RecipyCollection } from '../models/recipies.models';
import { CalendarComment, CalendarRecipyInDatabase_Reworked, RecipyForCalendar_Reworked } from '../models/calendar.models';
import { isDateBefore } from '../pages/calendar/calendar.utils';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  userApiService = inject(AuthApiService);
  uiService = inject(UiService)

  private currentUser = signal<User | null>(null);

  isUserLoggedIn = computed(() => !!this.currentUser())
  isAdmin = computed(() => this.currentUser()?.role === Role.Admin)
  userId = computed(() => this.currentUser()?.id || null);
  userEmail = computed(() => this.currentUser()?.email || null);
  userShoppingLists = computed(() => this.currentUser()?.shoppingLists || []);
  userImg = computed(() => this.currentUser()?.img || null);
  userRole = computed(() => this.currentUser()?.role || null);
  userRecipeCollections = computed(() => this.currentUser()?.collections || []);
  userDraftRecipies = computed(() => this.currentUser()?.draftRecipies || []);
  userPreferences = computed(() => this.currentUser()?.preferences || null);
  userFamily = computed(() => this.currentUser()?.family || []);
  userPlannedRecipies = computed(() => this.currentUser()?.plannedRecipies || []);
  userPlannedComments = computed(() => this.currentUser()?.plannedComments || []);

  setCurrentUser(user: User) {
    this.currentUser.set(user)
  }

  private updateUserData(updates: Partial<User>): Observable<User | null> {
    const userId = this.currentUser()?.id
    if (!this.currentUser() || !userId) return of(null);

    this.uiService.setIsLoadingTrue();
    return this.userApiService.updateUser(userId, updates).pipe(
      take(1),
      tap(() => {
        this.currentUser.update(curr => {
          if (!curr) {
            return null
          } else {
            return { ...curr, ...updates }
          }
        })
      }),
      finalize(() => this.uiService.setIsLoadingFalse()),
      catchError(err => {
        this.uiService.setError(`Не вдалось зберегти: ${err.message}`)
        return of(null)
      })
    )
  }

  resetCurrentUser() {
    this.currentUser.set(null)
  }

  updatePreferences(updatedPreferences: Preferences): void {
    this.updateUserData({ preferences: updatedPreferences }).subscribe((user: User | null) => {
      if (user) {
        this.uiService.showSuccessMessage('Налаштування збережено')
      }
    })
  }

  updateNoShowRecipies(updatedIds: string[]) {
    const currentPreferences = this.userPreferences()
    if (this.isUserLoggedIn() && currentPreferences) {
      const updatedPreferences = { ...currentPreferences, noShowRecipies: updatedIds };
      this.updatePreferences(updatedPreferences)
    } else if (this.isUserLoggedIn()) {
      const updatedPreferences = { ...defaultPrefs, noShowRecipies: updatedIds };
      this.updatePreferences(updatedPreferences)
    }
  }

  updateFamily(updatedFamily: FamilyMember[]): void {
    this.updateUserData({ family: updatedFamily }).subscribe((user: User | null) => {
      if (user) {
        this.uiService.showSuccessMessage('Налаштування сім\'ї збережено')
      }
    })
  }

  createCollection(collectionName: string): void {
    const updatedCollections = this.userRecipeCollections().concat({
      name: collectionName,
      recipies: [],
    });

    this.updateUserData({ collections: updatedCollections }).subscribe((user: User | null) => {
      if (user) {
        this.uiService.showSuccessMessage(`Колекція ${collectionName} створена`)
      }
    })
  }

  updateCollections(updatedCollections: RecipyCollection[]) {
    this.updateUserData({ collections: updatedCollections }).subscribe((user: User | null) => {
      if (user) {
        this.uiService.showSuccessMessage(`Зміни збережено`)
      }
    })
  }

  updateShoppingLists(updatedList: ShoppingList[]) {
    this.updateUserData({ shoppingLists: updatedList }).subscribe((user: User | null) => {
      if (user) {
        this.uiService.showSuccessMessage('Список покупок оновлено')
      }
    })
  }

  addDraftRecipy(recipy: DraftRecipy) {
    let currentDrafts = this.userDraftRecipies();
    if (!currentDrafts) {
      currentDrafts = [recipy]
    } else {
      currentDrafts = currentDrafts.concat(recipy)
    }
    this.updateUserData({ draftRecipies: currentDrafts }).subscribe((user: User | null) => {
      if (user) {
        this.uiService.showSuccessMessage(`${recipy.name} додано в чернетки`)
      }
    })
  }

  updateDraftRecipy(recipy: DraftRecipy, order: number) {
    let currentDrafts = this.userDraftRecipies();
    currentDrafts[order] = recipy;
    this.updateUserData({ draftRecipies: currentDrafts }).subscribe((user: User | null) => {
      if (user) {
        this.uiService.showSuccessMessage(`${recipy.name} - чернетку оновлено`)
      }
    })
  }

  deleteDraftRecipy(index: number) {
    let currentDrafts = this.userDraftRecipies().filter((item, i) => i !== index);
    this.updateUserData({ draftRecipies: currentDrafts }).subscribe((user: User | null) => {
      if (user) {
        this.uiService.showSuccessMessage(`Чернетку видалено`)
      }
    })
  }

  //Calendar

  addRecipyToCalendar(recipyEntry: RecipyForCalendar_Reworked) {
    let recipyToSave: CalendarRecipyInDatabase_Reworked = {
      recipyId: recipyEntry.id,
      portions: recipyEntry.portions,
      amountPerPortion: recipyEntry.amountPerPortion,
      endTime: recipyEntry.endTime,
      entryId: recipyEntry.entryId
    }
    const updatedRecipies = this.userPlannedRecipies().concat(recipyToSave);
    this.updateUserData({ plannedRecipies: updatedRecipies }).subscribe((user: User | null) => {
      if (user) {
        this.uiService.showSuccessMessage(`${recipyEntry.name} додано`)
      }
    })

  }

  addCommentToCalendar(comment: string, selectedDate: Date, isReminder: boolean) {
    let commentToAdd: CalendarComment = {
      comment: comment,
      date: selectedDate,
      isReminder: isReminder
    }
    const updatedComments = this.userPlannedComments().concat(commentToAdd);
    this.updateUserData({ plannedComments: updatedComments }).subscribe((user: User | null) => {
      if (user) {
        this.uiService.showSuccessMessage(`${isReminder ? 'Нагадування' : 'Коментар'} додано`)
      }
    })
  }

  updateCommentInCalendar(previousEntry: CalendarComment, newEntry: CalendarComment) {
    const updatedComments = this.userPlannedComments().map(commentEntry => {
      if (commentEntry.comment === previousEntry.comment &&
        commentEntry.date === previousEntry.date
      ) {
        return newEntry
      } else return commentEntry
    })

    this.updateUserData({ plannedComments: updatedComments }).subscribe((user: User | null) => {
      if (user) {
        this.uiService.showSuccessMessage(`${previousEntry.isReminder ? 'Нагадування' : 'Коментар'} оновлено`)
      }
    })
  }

  removeCommentFromCalendar(comment: CalendarComment) {
    const updatedComments = this.userPlannedComments().filter(commentEntry => commentEntry.comment !== comment.comment &&
      commentEntry.date !== comment.date)
    this.updateUserData({ plannedComments: updatedComments }).subscribe((user: User | null) => {
      if (user) {
        this.uiService.showSuccessMessage(`${comment.isReminder ? 'Нагадування' : 'Коментар'} видалено`)
      }
    })
  }

  updateRecipyInCalendar(previousEntry: RecipyForCalendar_Reworked, newEntry: RecipyForCalendar_Reworked) {
    const updatedRecipies = this.userPlannedRecipies().map(recipy => {
      if (
        recipy.recipyId === previousEntry.id &&
        recipy.portions === previousEntry.portions &&
        recipy.amountPerPortion === previousEntry.amountPerPortion &&
        previousEntry.endTime === recipy.endTime) {
        let recipyToSave: CalendarRecipyInDatabase_Reworked = {
          recipyId: newEntry.id,
          portions: newEntry.portions,
          amountPerPortion: newEntry.amountPerPortion,
          endTime: newEntry.endTime,
          entryId: newEntry.entryId
        }
        return recipyToSave
      } else {
        return recipy
      }
    })
    this.updateUserData({ plannedRecipies: updatedRecipies }).subscribe((user: User | null) => {
      if (user) {
        this.uiService.showSuccessMessage(`${newEntry.name} оновлено`)
      }
    })
  }

  removeRecipyFromCalendar(recipyEntry: RecipyForCalendar_Reworked) {
    const updatedRecipies = this.userPlannedRecipies().filter(recipy => {
      return !(
        recipy.recipyId === recipyEntry.id &&
        recipy.portions === recipyEntry.portions &&
        recipy.amountPerPortion === recipyEntry.amountPerPortion &&
        recipyEntry.endTime === recipy.endTime)
    })
    this.updateUserData({ plannedRecipies: updatedRecipies }).subscribe((user: User | null) => {
      if (user) {
        this.uiService.showSuccessMessage(`${recipyEntry.name} видалено`)
      }
    })
  }

  removePlannedRecipiesOlderThan(dateToCheck: Date) {
    if (this.isAdmin()) {
      const updatedPlannedRecipies = this.userPlannedRecipies().filter(recipy => !isDateBefore(new Date(recipy.endTime), dateToCheck));
      this.updateUserData({ plannedRecipies: updatedPlannedRecipies }).subscribe((user: User | null) => {
        if (user) {
          this.uiService.showSuccessMessage(`Дані до ${dateToCheck.toDateString()} видалено`)
        }
      })
    }


  }
}
