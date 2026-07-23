import { Component, computed, effect, EventEmitter, inject, input, Input, OnChanges, OnDestroy, Output, signal } from '@angular/core';
import { Subject } from 'rxjs';

import { getCurrentDayRecipies, isLessThanCertainDays, sortRecipiesByDate } from '../../../calendar.utils';
import { RecipiesService } from 'src/app/services/recipies.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-recipy-in-calendar-select-date',
  templateUrl: './recipy-in-calendar-select-date.component.html',
  styleUrls: ['./recipy-in-calendar-select-date.component.scss'],
})
export class RecipyInCalendarSelectDateComponent implements OnDestroy {
  recipiesService = inject(RecipiesService);
  userDataService = inject(UserDataService);

  initialValue = input<string | undefined>();

  @Output() valueChanged = new EventEmitter<string>();

  $selectedDate = signal<string | null>(null)
  $recipies = this.recipiesService.getRecipies;
  $userPlannedRecipies = this.userDataService.userPlannedRecipies;
  $recipiesForSelectedDate = computed(() => {
    const [userRecipies, selectedDate] = [this.$userPlannedRecipies(), this.$selectedDate()];
    if (userRecipies?.length && !!selectedDate && this.$recipies().length) {
      return getCurrentDayRecipies(userRecipies, new Date(selectedDate).toDateString(), this.$recipies()).sort((a, b) => sortRecipiesByDate(a, b))
    } else return []
  })

  $timeShortcuts = computed(() => {
    const recipyTime = this.$userPlannedRecipies()
      .filter(rec => isLessThanCertainDays(new Date(rec.endTime), 20))
      .map(item => item.endTime)
      .map(time => this.fixTime(new Date(time).getHours()) + ':' + this.fixTime(new Date(time).getMinutes())
      )
    const uniques = new Set(recipyTime);
    return Array.from(uniques).sort((a, b) => a.localeCompare(b))
  }
  )

  constructor(
  ) {
    effect(() => {
      const init = this.initialValue();
      if (init) {
        this.value = init;
        this.$selectedDate.set(init)
      }
    }, { allowSignalWrites: true })
  }
  ngOnDestroy(): void {
    this.destroyed$.next()
  }

  value: any;

  destroyed$ = new Subject<void>()

  onSelectionChanged(event: any) {
    this.valueChanged.emit(event.detail.value);
  }

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
    this.$selectedDate.set(updated)
    this.valueChanged.emit(updated)
  }


}
