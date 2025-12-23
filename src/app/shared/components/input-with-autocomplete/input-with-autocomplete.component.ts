import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
    selector: 'app-input-with-autocomplete',
    templateUrl: './input-with-autocomplete.component.html',
    styleUrls: ['./input-with-autocomplete.component.scss'],
    standalone: false
})
export class InputWithAutocompleteComponent {
  @Input() suggestions: string[] = [];
  @Input() placeholder: string = '';

  @Output() itemSelected = new EventEmitter<string>();
  isSelected = false;

  inputItem: string = '';

  initialValue: string = ''

  setSelected(value: string) {
    this.initialValue = value;
  }

  selectEvent(item: string) {
    this.isSelected = true;
    this.itemSelected.emit(item);
    this.autocomplete.close();
  }

  onClearSearch() {
    this.isSelected = false;
    this.initialValue = '';
  }

  @ViewChild('autocomplete') autocomplete: any;
  clearSearch() {
    this.autocomplete.clear();
    this.autocomplete.close();
  }
}
