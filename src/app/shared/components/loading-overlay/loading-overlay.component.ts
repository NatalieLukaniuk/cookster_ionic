import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-overlay',
  templateUrl: './loading-overlay.component.html',
  styleUrls: ['./loading-overlay.component.scss'],
})
export class LoadingOverlayComponent implements OnInit {
  @Input() isUserLoaded: boolean = false;
  @Input() isRecipiesLoaded: boolean = false;
  @Input() isProductsLoaded: boolean = false;

  constructor() { }

  ngOnInit() {}

}
