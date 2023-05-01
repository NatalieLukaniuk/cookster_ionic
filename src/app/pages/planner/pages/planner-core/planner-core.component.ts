import { CalendarService } from 'src/app/services/calendar.service';
import {
  SetCurrentPlannerByDateAction,
  ResetCurrentPlannerByDateAction,
} from './../../../../store/actions/planner.actions';
import { Component, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { takeUntil, filter, map, Subject, combineLatest } from 'rxjs';
import { User } from 'src/app/models/auth.models';
import { PlannerByDate } from 'src/app/models/planner.models';
import { IAppState } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { getCurrentPlanner } from 'src/app/store/selectors/planners.selectors';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';

@Component({
  selector: 'app-planner-core',
  templateUrl: './planner-core.component.html',
  styleUrls: ['./planner-core.component.css'],
})
export class PlannerCoreComponent implements OnDestroy {
  tabs = [
    { name: 'planning', icon: 'calendar-outline' },
    { name: 'shopping', icon: 'cart-outline' },
    { name: 'preps', icon: 'alarm-outline' },
  ];
  currentTab = this.tabs[0].name;

  currentPlanner: PlannerByDate | undefined;
  destroyed$ = new Subject<void>();

  constructor(
    private store: Store<IAppState>,
    private calendarService: CalendarService
  ) {
    this.store
      .pipe(
        select(getCurrentUser),
        takeUntil(this.destroyed$),
        filter((user: User | null) => !!user),
        map((user) => {
          if (user) {
            return user.planner?.find((item) => {
              let split = window.location.pathname.split('/');

              let [startDate, endDate] = split[split.length - 1].split('_');
              return item.endDate === endDate && item.startDate === startDate;
            });
          } else return null;
        })
      )
      .subscribe((planner) => {
        if (planner) {
          this.store.dispatch(
            new SetCurrentPlannerByDateAction(
              planner.startDate + '_' + planner.endDate
            )
          );
          this.currentPlanner = planner;
        }
      });

    let currentUser$ = this.store.pipe(select(getCurrentUser));
    let allRecipies$ = this.store.pipe(select(getAllRecipies));

    let currentPlanner$ = this.store.pipe(
      select(getCurrentPlanner),
      filter((res) => !!res)
    );

    combineLatest([currentUser$, allRecipies$, currentPlanner$])
      .pipe(
        takeUntil(this.destroyed$),
        map((res) => ({ user: res[0], recipies: res[1], planner: res[2] }))
      )
      .subscribe((res) => {
        if (res.planner) {
          this.currentPlanner = res.planner;
        }

        if (res.user && res.user.details) {
        }
        if (res.planner && res.user && res.recipies) {
          let start =
            res.planner.startDate.substring(4) +
            res.planner.startDate.substring(2, 4) +
            res.planner.startDate.substring(0, 2);
          let end =
            res.planner.endDate.substring(4) +
            res.planner.endDate.substring(2, 4) +
            res.planner.endDate.substring(0, 2);
          if (res.user.details) {
            let userCalendarData = res.user.details;
            this.calendarService.buildCalendarInRange(
              start,
              end,
              userCalendarData,
              res.recipies
            );
          }
        }
      });
  }

  onTabChange(event: any) {
    this.currentTab = event.detail.value;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.store.dispatch(new ResetCurrentPlannerByDateAction());
  }
}
