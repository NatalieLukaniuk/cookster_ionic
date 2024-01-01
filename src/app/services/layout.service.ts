import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  private isLandscape$ = new BehaviorSubject<boolean>(window.innerWidth > window.innerHeight);

  constructor() { }

  trackOrientationChange() {
    window.addEventListener("orientationchange", this.onOrientationChange)
  }

  onOrientationChange = () => {
    const isLandscape = screen.orientation.type === 'landscape-primary';    
    this.isLandscape$.next(isLandscape);
  }

  getIsLandscape() {
    return this.isLandscape$.asObservable()
  }
}
