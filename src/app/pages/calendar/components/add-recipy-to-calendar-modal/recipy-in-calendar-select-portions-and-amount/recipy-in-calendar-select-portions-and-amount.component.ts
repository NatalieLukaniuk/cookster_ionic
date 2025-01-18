import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-recipy-in-calendar-select-portions-and-amount',
  templateUrl: './recipy-in-calendar-select-portions-and-amount.component.html',
  styleUrls: ['./recipy-in-calendar-select-portions-and-amount.component.scss'],
})
export class RecipyInCalendarSelectPortionsAndAmountComponent implements OnInit {
  @Input() initialPortionsValue: number | undefined;
  @Input() initialAmountValue: number | undefined;

  @Output() portionsValueChanged = new EventEmitter<number>();
  @Output() amountValueChanged = new EventEmitter<number>();

  portions = 0;
  amount = 0;

  ngOnInit() {
    if (this.initialAmountValue) {
      this.amount = this.initialAmountValue;
    }
    if (this.initialPortionsValue) {
      this.portions = this.initialPortionsValue;
    }
  }

  onAmountValueChanged(event: string) {
    if (event) {
      this.amountValueChanged.emit(+event);
    }
  }

  onPortionsValueChanged(event: string) {
    if (event) {
      this.portionsValueChanged.emit(+event);
    }
  }

}
