import { Component, HostListener, OnInit } from '@angular/core';
import { SIDEBAR_EXPANDED_WIDTH } from '../../constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  isDesktop = window.innerWidth >= SIDEBAR_EXPANDED_WIDTH;
  
  constructor() { }

  ngOnInit() {}

  @HostListener('window:resize')
  onResize(){
    this.isDesktop = window.innerWidth >= SIDEBAR_EXPANDED_WIDTH;
  }

}
