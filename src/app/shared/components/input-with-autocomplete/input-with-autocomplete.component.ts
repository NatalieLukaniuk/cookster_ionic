import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-input-with-autocomplete',
  templateUrl: './input-with-autocomplete.component.html',
  styleUrls: ['./input-with-autocomplete.component.scss']
})
export class InputWithAutocompleteComponent {
  @Input() suggestions: string[] = [];
  @Input() placeholder: string = '';

  @Output() itemSelected = new EventEmitter<string>();
  isSelected = false;

  inputItem: string = '';

  selectEvent(item: string) {
    this.isSelected = true;
    this.itemSelected.emit(item);
  }

  onClearSearch() {
    this.isSelected = false;
  }

  @ViewChild('autocomplete') autocomplete: any;
  clearSearch() {
    this.autocomplete.clear();
  }
}
