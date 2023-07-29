import { Component, OnInit } from '@angular/core';
import { AngularDeviceInformationService } from 'angular-device-information';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  isDesktop = this.deviceInformationService.isDesktop();
  
  constructor(private deviceInformationService: AngularDeviceInformationService) { }

  ngOnInit() {}

}
