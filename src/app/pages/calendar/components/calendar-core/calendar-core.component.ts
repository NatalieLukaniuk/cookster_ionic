import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/models/auth.models';
import { Day, DayDetails } from 'src/app/models/calendar.models';
import { CalendarService } from 'src/app/services/calendar.service';
import { IAppState } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

@Component({
  selector: 'app-calendar-core',
  templateUrl: './calendar-core.component.html',
  styleUrls: ['./calendar-core.component.scss'],
})
export class CalendarCoreComponent implements OnInit, OnDestroy {
  @Input() showPreps: boolean = true;
  @Input() addRecipies: boolean = false;
  @Output() currentTabChanged = new EventEmitter<string>()

  currentDay: moment.Moment | undefined;
  _day: Day | undefined;

  isWithinDateRange = false;

  dayChanged$ = new Subject<void>();

  currentUser: User | undefined;

  destroy$ = new Subject<void>();

  tabs = [
    { value: 'menu', icon: '', name: 'Меню' },
    { value: 'preps', icon: '', name: 'Нагадування' },
    { value: 'products', icon: '', name: 'Продукти' },
  ];

  prepsNumber = 0;

  currentTab = this.tabs[0].value;

  constructor(
    private store: Store<IAppState>,
    private calendarService: CalendarService
  ) {
    this.dayChanged$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.getDayDetails();
    });
  }

  ngOnInit() {
    this.currentDay = moment().clone();
    this.dayChanged$.next();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
  // FIXME: check whether the page does gets destroyed

  goPreviousDay() {
    this.currentDay!.subtract(1, 'day');
    this.dayChanged$.next();
  }
  goNextDay() {
    this.currentDay?.add(1, 'day');
    this.dayChanged$.next();
  }

  onTabChange(event: any) {
    this.currentTab = event.detail.value;
    this.currentTabChanged.emit(event.detail.value)
  }

  getDayDetails() {
    if (this.currentDay) {
      this.store.pipe(select(getCurrentUser)).subscribe((user) => {
        let stringDay = this.currentDay!.clone().format('DDMMYYYY');
        if (user) {
          this.currentUser = user;
          let details = user.details?.find(
            (day: DayDetails) => day?.day == stringDay
          );
          if (details) {            
            let newDayDetails = new DayDetails(
              this.currentDay!.format('DDMMYYYY'),
              details.comments? details.comments : []
            );
            let dayTemplate: Day = {
              value: this.currentDay!,
              active: true,
              selected: false,
              disabled: false,
              details: {
                ...newDayDetails,
                breakfastRecipies: [],
                lunchRecipies: [],
                dinnerRecipies: [],
              },
            };
            this.calendarService
              .getRecipiesAndBuildDay(details, dayTemplate)
              .subscribe((res) => {
                if (res) {
                  this._day = res;
                }
              });
          } else {
            this._day = {
              value: this.currentDay!,
              active: true,
              selected: false,
              disabled: false,
              details: {
                breakfastRecipies: [],
                lunchRecipies: [],
                dinnerRecipies: [],
                day: stringDay,
                breakfast: [],
                lunch: [],
                dinner: [],
                comments: []
              },
            };
          }

          if (user.savedPreps) {
            this.prepsNumber = user.savedPreps.filter(prep => prep.calendarDay === this._day?.details.day).length;
          }
        }
      });
    }
  }
}
