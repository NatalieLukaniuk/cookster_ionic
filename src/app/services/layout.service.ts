import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

const TABLET_MIN_WIDTH = 600;
const TABLET_MAX_WIDTH = 800;
const TABLET_MIN_HEIGHT = 962;
const TABLET_MAX_HEIGHT = 1000;

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

  getIsBigScreen() {
    return this.getIsWideScreen() && this.getIsHighScreen()
  }

  getIsWideScreen() {
    return window.innerWidth > 600
  }

  getIsHighScreen() {
    return window.innerHeight > 600
  }

  getIsTablet() {
    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;
    return !this.getIsDesktop() && !this.getIsMobile();     
  }

  getIsDesktop() {
    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;
    return (currentWidth > TABLET_MAX_WIDTH && currentHeight > TABLET_MAX_HEIGHT) && currentWidth > currentHeight
  }

  getIsMobile() {
    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;
    return (currentWidth < TABLET_MIN_WIDTH && currentHeight < TABLET_MIN_HEIGHT) ||
      (currentHeight < TABLET_MIN_WIDTH && currentWidth < TABLET_MIN_HEIGHT)
  }
}
