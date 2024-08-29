import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { cloneDeep, isNaN, isNumber } from 'lodash';

export interface TableData {
  rows: [];
}

export interface LegendItem {
  name: string;
  active: boolean;
}

enum sortDirection {
  Up,
  Down
}
@Component({
  selector: 'app-admin-table',
  templateUrl: './admin-table.component.html',
  styleUrls: ['./admin-table.component.scss'],
})
export class AdminTableComponent implements OnChanges {
  @Input() data!: any[][];

  dataToDisplay: any[][] = [];

  sorting: { sortByIndex: number | null, direction: sortDirection | null } = { sortByIndex: null, direction: null };

  legendItems: LegendItem[] = [];

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    this.getLegendItems();
    this.getDataToDisplay()
  }

  getLegendItems() {
    this.legendItems = [];
    if (this.data[0]?.length) {
      for (let item of this.data[0]) {
        let legend: LegendItem = {
          name: item,
          active: true,
        };
        this.legendItems.push(legend);
      }
    }
  }

  sortDirection = sortDirection;

  sort(headerIndex: number) {
    if (this.sorting.sortByIndex !== headerIndex) {
      this.sorting = {
        sortByIndex: headerIndex,
        direction: sortDirection.Up
      }
    } else {
      this.sorting = {
        ...this.sorting,
        direction: this.sorting.direction === sortDirection.Down? sortDirection.Up : sortDirection.Down
      }
    }

    this.getDataToDisplay()
  }

  getDataToDisplay(): any[][] {
    this.dataToDisplay = cloneDeep(this.data);
    const propertyIndex = this.sorting.sortByIndex;
    if (propertyIndex === null) {
      return this.dataToDisplay
    } else if (this.sorting.direction === sortDirection.Down) {
      this.dataToDisplay.sort((a, b) => this.sortDescending(a, b, propertyIndex))
    } else {
      this.dataToDisplay.sort((a, b) => this.sortAscending(a, b, propertyIndex))
    }
    return this.dataToDisplay;
  }

  sortDescending = (a: any[], b: any[], propertyIndex: number) => {

    if (a[0] === this.data[0]) {
      return 0
    } else if (b[0] === this.data[0][0]) {
      return 1
    };

    if(a[propertyIndex] === undefined || isNaN(a[propertyIndex])){
      return 1
    }
    if(b[propertyIndex] === undefined || isNaN(b[propertyIndex])){
      return -1
    }

    if (isNumber(a[propertyIndex]) && isNumber(b[propertyIndex])) {
      if (a[propertyIndex] > b[propertyIndex]) {
        return -1
      } else return 1
    }

    if (isNumber(a[propertyIndex])) {
      return -1
    }
    if (isNumber(b[propertyIndex])) {
      return 1
    }
    
    // works for strings, but not for numbers
    if (JSON.stringify(a[propertyIndex]).toLocaleLowerCase() > JSON.stringify(b[propertyIndex]).toLocaleLowerCase()) {
      return -1
    } else return 1
  }

  sortAscending = (a: any[], b: any[], propertyIndex: number) => {

    if (a[0] === this.data[0]) {
      return 0
    } else if (b[0] === this.data[0][0]) {
      return 1
    };

    if(a[propertyIndex] === undefined || isNaN(a[propertyIndex])){
      return -1
    }
    if(b[propertyIndex] === undefined || isNaN(b[propertyIndex])){
      return 1
    }
    
    if (isNumber(a[propertyIndex]) && isNumber(b[propertyIndex])) {
      if (a[propertyIndex] > b[propertyIndex]) {
        return 1
      } else return -1
    }

    if (isNumber(a[propertyIndex])) {
      return 1
    }
    if (isNumber(b[propertyIndex])) {
      return -1
    }

   
    if (JSON.stringify(a[propertyIndex]).toLocaleLowerCase() > JSON.stringify(b[propertyIndex]).toLocaleLowerCase()) {
      return 1
    } else return -1
  }

  onLegendClick(item: LegendItem) {
    item.active = !item.active;
  }

  isActionItem(item: any) {
    return item && !!item.title && !!item.action;
  }
}
