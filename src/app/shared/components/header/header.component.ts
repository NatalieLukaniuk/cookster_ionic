import { Component, HostListener, Input, OnInit } from '@angular/core';
import { SIDEBAR_EXPANDED_WIDTH } from '../../constants';
import { select, Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: false
})
export class HeaderComponent implements OnInit {
  @Input() isShowDoubleToolbar = true;

  isLoggedIn$ = this.store.pipe(select(getCurrentUser));

  isDesktop = window.innerWidth >= SIDEBAR_EXPANDED_WIDTH;
  
  constructor(private store: Store<IAppState>, private router:Router) { }

  ngOnInit() {}

  @HostListener('window:resize')
  onResize(){
    this.isDesktop = window.innerWidth >= SIDEBAR_EXPANDED_WIDTH;
  }

  goLogin(){
    this.router.navigate(['tabs', 'auth'])
  }

}
