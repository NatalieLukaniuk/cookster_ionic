import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs';
import { IAppState } from 'src/app/store/reducers';
import { getUserPlannedRecipies } from 'src/app/store/selectors/user.selectors';

@Component({
  selector: 'app-recipy-in-calendar-select-date',
  templateUrl: './recipy-in-calendar-select-date.component.html',
  styleUrls: ['./recipy-in-calendar-select-date.component.scss'],
})
export class RecipyInCalendarSelectDateComponent implements OnChanges {

  @Input() initialValue: string | undefined;

  @Output() valueChanged = new EventEmitter<string>();

  constructor(
    private store: Store<IAppState>,
  ) { }

  value: any;

  ngOnChanges() {
    if (this.initialValue) {
      this.value = this.initialValue;
    }
  }

  onSelectionChanged(event: any) {
    this.valueChanged.emit(event.detail.value);
  }

  timeShortcuts$ = this.store.pipe(select(getUserPlannedRecipies), map(recipies => {
    if (recipies?.length) {
      const recipyTime = recipies.map(item => item.endTime).map(time => this.fixTime(new Date(time).getHours()) + ':' + this.fixTime(new Date(time).getMinutes()));
      const uniques = new Set(recipyTime);
      return Array.from(uniques)
    } else { return [] }
  }))

  fixTime(value: number) {
    if (value === 0) {
      return '00'
    } else if (value < 10) {
      return '0' + value
    } else return value.toString()
  }

  changeTime(item: string) {

    if (this.value) {
      const selectedDayString = new Date(this.value).toString();
      const updated = selectedDayString.replace(/\d\d:\d\d:\d\d/gm, item + ':00')
      this.value = new Date(updated)
      this.valueChanged.emit(updated)
    }
  }


}
