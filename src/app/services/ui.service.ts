import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private isLoading = signal(false);
  getIsLoading = this.isLoading.asReadonly();

  private successMessage = signal<string | null>(null);
  getIsSuccessMessage = this.successMessage.asReadonly();

  private error = signal<string | null>(null);
  getIsError = this.error.asReadonly();

  private isSidebarOpen = signal(false);
  getIsSidebarOpen = this.isSidebarOpen.asReadonly();

  private currentRoute = signal('');
  getCurrentRoute = this.currentRoute.asReadonly();

  private previousRoute = signal('');
  getPreviousRoute = this.previousRoute.asReadonly();

  setCurrentRoute(route: string) {
    const current = this.currentRoute();
    this.previousRoute.set(current);
    this.currentRoute.set(route);
  }

  setIsLoadingTrue() {
    this.isLoading.set(true);
  }

  setIsLoadingFalse() {
    this.isLoading.set(false);
  }

  showSuccessMessage(message: string) {
    this.successMessage.set(message);
  }

  dismissSuccessMessage() {
    this.successMessage.set(null);
  }

  setError(details: string) {
    this.error.set(details)
  }

  resetError() {
    this.error.set(null);
  }

  setIsSidebarOpen(isOpen: boolean) {
    this.isSidebarOpen.set(isOpen)
  }
}
