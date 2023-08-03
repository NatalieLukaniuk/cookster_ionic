import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

export interface TableData {
  rows: [];
}

export interface LegendItem {
  name: string;
  active: boolean;
}
@Component({
  selector: 'app-admin-table',
  templateUrl: './admin-table.component.html',
  styleUrls: ['./admin-table.component.scss'],
})
export class AdminTableComponent implements OnChanges {
  @Input() data!: any[][];

  legendItems: LegendItem[] = [];

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    this.getLegendItems();
  }

  getLegendItems() {
    this.legendItems = [];
    if (this.data[0].length) {
      for (let item of this.data[0]) {
        let legend: LegendItem = {
          name: item,
          active: true,
        };
        this.legendItems.push(legend);
      }
    }
  }

  onLegendClick(item: LegendItem) {
    item.active = !item.active;
  }

  isActionItem(item: any) {
    return item && !!item.title && !!item.action;
  }
}
