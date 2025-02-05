import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'app-recipy-in-calendar-select-date',
  templateUrl: './recipy-in-calendar-select-date.component.html',
  styleUrls: ['./recipy-in-calendar-select-date.component.scss'],
})
export class RecipyInCalendarSelectDateComponent implements OnChanges {

  @Input() initialValue: string | undefined;

  @Output() valueChanged = new EventEmitter<string>();

  value: any;

  ngOnChanges() {
    if (this.initialValue) {
      this.value = this.initialValue;
    }
  }

  onSelectionChanged(event: any) {
    this.valueChanged.emit(event.detail.value);
  }

}
