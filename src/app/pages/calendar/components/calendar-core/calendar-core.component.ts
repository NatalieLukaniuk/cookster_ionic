import { Reminder } from './../../../../models/calendar.models';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/models/auth.models';
import { Day, DayDetails } from 'src/app/models/calendar.models';
import { CalendarService } from 'src/app/services/calendar.service';
import { IAppState } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

export enum CalendarTabs {
  Menu = 'menu',
  Reminders = 'preps',
  Products = 'products'
}

@Component({
  selector: 'app-calendar-core',
  templateUrl: './calendar-core.component.html',
  styleUrls: ['./calendar-core.component.scss'],
})
export class CalendarCoreComponent implements OnInit, OnDestroy {
  @Input() addRecipies: boolean = false;
  @Output() currentTabChanged = new EventEmitter<string>()

  currentDay: moment.Moment | undefined;
  _day: Day | undefined;

  isWithinDateRange = false;

  dayChanged$ = new Subject<void>();

  currentUser: User | undefined;

  destroy$ = new Subject<void>();

  reminders: Reminder[] = [];

  isPassedReminders = false;

  CalendarTabs = CalendarTabs;

  tabs = [
    { value: CalendarTabs.Menu, icon: '', name: 'Меню' },
    { value: CalendarTabs.Reminders, icon: '', name: 'Нагадування' },
    { value: CalendarTabs.Products, icon: '', name: 'Продукти' },
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
      this.store.pipe(select(getCurrentUser), takeUntil(this.dayChanged$)).subscribe((user) => {
        let stringDay = this.currentDay!.clone().format('DDMMYYYY');
        if (user) {
          this.currentUser = user;
          let details = user.details?.find(
            (day: DayDetails) => day?.day == stringDay
          );
          if (details) {
            let newDayDetails = new DayDetails(
              this.currentDay!.format('DDMMYYYY'),
              details.comments ? details.comments : []
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

          this.reminders = [];
          this.isPassedReminders = false;
          if (user.savedPreps) {
            this.reminders = user.savedPreps.filter(prep => prep.calendarDay === this._day?.details.day);
            this.prepsNumber = this.reminders.length;
            this.isPassedReminders = this.checkTimePassed(this.reminders);            
          }
          this.checkCurrentTab()
        }
      });
    }
  }

  isTimePassed(reminder: Reminder) {
    if (reminder.fullDate) {
      let now = new Date();
      if (moment(now).isAfter(moment(reminder.fullDate))) {
        return true
      } else {
        return false
      }
    } else return false;
  }

  checkTimePassed(reminderList: Reminder[]): boolean {
    return !!reminderList.find((sugg) => this.isTimePassed(sugg));
  }

  isTabDisplayed(tab: CalendarTabs) {
    switch (tab) {
      case CalendarTabs.Menu:
      case CalendarTabs.Products: return true;
      case CalendarTabs.Reminders: return this.prepsNumber > 0
    }
  }

  checkCurrentTab(){
    if(!this.isTabDisplayed(this.currentTab)){
      this.currentTab = CalendarTabs.Menu
    }
  }
}
