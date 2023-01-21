import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { filter, map, Subject, takeUntil } from 'rxjs';
import { PlannerByDate } from 'src/app/models/planner.models';
import { IAppState } from 'src/app/store/reducers';
import { getCurrentPlanner } from 'src/app/store/selectors/planners.selectors';
import { User } from 'src/app/models/auth.models';
import * as moment from 'moment';

@Component({
  selector: 'app-planner-main',
  templateUrl: './planner-main.component.html',
  styleUrls: ['./planner-main.component.scss'],
})
export class PlannerMainComponent implements OnInit, OnDestroy {
  currentPlanner: PlannerByDate | undefined;
  destroyed$ = new Subject<void>();

  moment = moment;

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

  ngOnInit() {}

  ngOnDestroy(): void {
    this.destroyed$.next();
  }
  getDisplayRange() {
    if (this.currentPlanner) {
      return {
        startDate: this.currentPlanner.startDate,
        endDate: this.currentPlanner.endDate,
      };
    } else return undefined;
  }
}
