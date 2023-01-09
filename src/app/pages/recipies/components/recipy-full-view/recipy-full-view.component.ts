import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/auth.models';
import { Recipy } from 'src/app/models/recipies.models';
@Component({
  selector: 'app-recipy-full-view',
  templateUrl: './recipy-full-view.component.html',
  styleUrls: ['./recipy-full-view.component.scss'],
})
export class RecipyFullViewComponent implements OnInit {
  @Input() recipy: Recipy | undefined | null;
  @Input() currentUser!: User | null;

  @Input() portions?: number;
  @Input() amountPerPortion?: number;

  tabs = [
    { value: 'ingredients', icon: '', name: 'Інгридієнти' },
    { value: 'steps', icon: '', name: 'Приготування' },
    { value: 'info', icon: '', name: 'Інформація' },
  ];

  currentTab = this.tabs[0].value;

  selectedStepId = 0;

  constructor() {}

  ngOnInit() {}

  onTabChange(event: any) {
    this.currentTab = event.detail.value;
  }
}
