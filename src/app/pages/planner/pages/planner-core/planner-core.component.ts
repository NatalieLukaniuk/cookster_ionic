import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { takeUntil, filter, map, Subject } from 'rxjs';
import { User } from 'src/app/models/auth.models';
import { PlannerByDate } from 'src/app/models/planner.models';
import { IAppState } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

@Component({
  selector: 'app-planner-core',
  templateUrl: './planner-core.component.html',
  styleUrls: ['./planner-core.component.css']
})
export class PlannerCoreComponent implements OnDestroy {
  tabs = [
    {name: 'planning', icon: 'calendar-outline'},
    {name: 'shopping', icon: 'cart-outline'},
    {name: 'preps', icon: 'alarm-outline'},
  ]
  currentTab = this.tabs[0].name;

  currentPlanner: PlannerByDate | undefined;
  destroyed$ = new Subject<void>();

  constructor(private store: Store<IAppState>) {
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
          this.currentPlanner = planner;
        }
      });
  }

  onTabChange(event: any){
    this.currentTab = event.detail.value;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
