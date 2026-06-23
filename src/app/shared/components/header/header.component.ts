import { Component, HostListener, inject, Input, OnInit } from '@angular/core';
import { SIDEBAR_EXPANDED_WIDTH } from '../../constants';
import { Router } from '@angular/router';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  userDataService = inject(UserDataService);
  @Input() isShowDoubleToolbar = true;

  $isLoggedIn = this.userDataService.isUserLoggedIn;

  isDesktop = window.innerWidth >= SIDEBAR_EXPANDED_WIDTH;
  
  constructor(private router:Router) { }

  @HostListener('window:resize')
  onResize(){
    this.isDesktop = window.innerWidth >= SIDEBAR_EXPANDED_WIDTH;
  }

  goLogin(){
    this.router.navigate(['tabs', 'auth'])
  }

}
