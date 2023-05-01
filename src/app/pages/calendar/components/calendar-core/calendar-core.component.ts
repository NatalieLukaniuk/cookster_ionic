import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
  @Input() setCurrentDay: moment.Moment | undefined;
  @Input() setEndDate: moment.Moment | undefined;
  @Input() showPreps: boolean = true;
  @Input() addRecipies: boolean = false;

  currentDay: moment.Moment | undefined;
  _day: Day | undefined;

  isWithinDateRange = false;

  dayChanged$ = new Subject<void>();

  currentUser: User | undefined;

  destroy$ = new Subject<void>();

  tabs = [
    { value: 'menu', icon: '', name: 'Меню' },
    { value: 'preps', icon: '', name: 'Попереднє приготування' },
  ];

  currentTab = this.tabs[0].value;

  constructor(
    private store: Store<IAppState>,
    private calendarService: CalendarService
  ) {
    this.dayChanged$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.getDayDetails();
      this.updateVariables();
    });
  }

  updateVariables() {
    if (this.currentDay && this.setCurrentDay && this.setEndDate) {
      this.isWithinDateRange = this.currentDay.isBetween(
        this.setCurrentDay.clone().subtract(1, 'day'),
        this.setEndDate.clone().add(1, 'day')
      );
    } else {
      this.isWithinDateRange = false;
    }
  }

  ngOnInit() {
    if (!this.setCurrentDay) {
      this.currentDay = moment().clone();
    } else {
      console.log(this.setCurrentDay);
      this.currentDay = this.setCurrentDay.clone();
    }

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
  }

  getDayDetails() {
    if (this.currentDay) {
      this.store.pipe(select(getCurrentUser)).subscribe((user) => {
        let stringDay = this.currentDay!.clone().format('DDMMYYYY');
        if (user) {
          this.currentUser = user;
          let details = user.details?.find(
            (day: DayDetails) => day.day == stringDay
          );
          if (details) {
            let newDayDetails = new DayDetails(
              this.currentDay!.format('DDMMYYYY')
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
              },
            };
          }
        }
      });
    }
  }
}
