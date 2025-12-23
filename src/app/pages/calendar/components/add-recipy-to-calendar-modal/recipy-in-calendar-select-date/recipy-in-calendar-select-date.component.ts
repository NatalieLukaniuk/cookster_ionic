import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, map, Subject, takeUntil } from 'rxjs';
import { IAppState } from 'src/app/store/reducers';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { getUserPlannedRecipies } from 'src/app/store/selectors/user.selectors';
import { getCurrentDayRecipies, isLessThanCertainDays, sortRecipiesByDate } from '../../../calendar.utils';

@Component({
    selector: 'app-recipy-in-calendar-select-date',
    templateUrl: './recipy-in-calendar-select-date.component.html',
    styleUrls: ['./recipy-in-calendar-select-date.component.scss'],
    standalone: false
})
export class RecipyInCalendarSelectDateComponent implements OnChanges, OnDestroy {

  @Input() initialValue: string | undefined;

  @Output() valueChanged = new EventEmitter<string>();

  constructor(
    private store: Store<IAppState>,
  ) { }
  ngOnDestroy(): void {
    this.destroyed$.next()
  }

  value: any;

  selectedDate$ = new BehaviorSubject<string | null>(null);

  destroyed$ = new Subject<void>()

  recipiesForSelectedDate$ = combineLatest([
    this.store.pipe(select(getUserPlannedRecipies)),
    this.selectedDate$,
    this.store.pipe(select(getAllRecipies))
  ]).pipe(
    takeUntil(this.destroyed$),
    map(res => {
      const [userRecipies, selectedDate, allRecipies] = res;
      if (userRecipies?.length && !!selectedDate && allRecipies.length) {
        return getCurrentDayRecipies(userRecipies, new Date(selectedDate).toDateString(), allRecipies).sort((a, b) => sortRecipiesByDate(a, b))
      } else return []

    })
  )

  ngOnChanges() {
    if (this.initialValue) {
      this.value = this.initialValue;
      this.selectedDate$.next(this.initialValue)
    }
  }

  onSelectionChanged(event: any) {
    this.valueChanged.emit(event.detail.value);
  }

  timeShortcuts$ = this.store.pipe(select(getUserPlannedRecipies), map(recipies => {
    if (recipies?.length) {
      const recipyTime = recipies.filter(rec => isLessThanCertainDays(new Date(rec.endTime), 20)).map(item => item.endTime).map(time => this.fixTime(new Date(time).getHours()) + ':' + this.fixTime(new Date(time).getMinutes()));
      const uniques = new Set(recipyTime);
      return Array.from(uniques).sort((a, b) => a.localeCompare(b))
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
    let selectedDayString;
    if (this.value) {
      selectedDayString = new Date(this.value).toString();

    } else {
      selectedDayString = new Date().toString();
    }
    const updated = selectedDayString.replace(/\d\d:\d\d:\d\d/gm, item + ':00')
    this.value = new Date(updated)
    this.selectedDate$.next(updated)
    this.valueChanged.emit(updated)
  }


}
