import { DataMappingService } from './../../../../services/data-mapping.service';
import { Component, Input, OnInit } from '@angular/core';
import { Recipy } from 'src/app/models/recipies.models';

@Component({
  selector: 'app-recipy-full-view',
  templateUrl: './recipy-full-view.component.html',
  styleUrls: ['./recipy-full-view.component.scss'],
})
export class RecipyFullViewComponent implements OnInit {
  @Input() recipy: Recipy | undefined | null;

  @Input() portions?: number;
  @Input() amountPerPortion?: number;

  tabs = [
    { value: 'ingredients', icon: '', name: 'Інгридієнти' },
    { value: 'steps', icon: '', name: 'Приготування' },
    { value: 'info', icon: '', name: 'Інформація' },
  ];

  currentTab = this.tabs[0].value;

  selectedStepId = 0;

  constructor(private datamapping: DataMappingService) {}

  ngOnInit() {}

  onTabChange(event: any) {
    this.currentTab = event.detail.value;
  }
}
