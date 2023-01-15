import { PlannerService } from './../../services/planner.service';
import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/models/auth.models';
import { Planner, PlannerByDate } from 'src/app/models/planner.models';
import { IAppState } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { getFormattedName, transformDate } from './planner.utils';

@Component({
  selector: 'app-planner',
  templateUrl: 'planner.page.html',
  styleUrls: ['planner.page.scss'],
})
export class PlannerPage implements OnDestroy {
  showDatePicker = false;

  plannersList: Planner[] = [];

  destroyed$ = new Subject<void>();

  dateExampleStart = new Date().toISOString();
  dateExampleEnd = new Date().toISOString();
  getFormattedName = getFormattedName;

  constructor(
    private store: Store<IAppState>,
    private router: Router,
    private plannerService: PlannerService
  ) {
    this.store
      .pipe(select(getCurrentUser), takeUntil(this.destroyed$))
      .subscribe((user: User | null) => {
        if (user && user.planner) {
          this.plannersList = user.planner;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  onAddNewPlanner() {
    this.showDatePicker = true;
  }

  onPlannerClicked(id: string) {
    // TODO implement navigation
    // this.router.navigate(['by-date/', id, 'planning'], {
    //   relativeTo: this.route,
    // });
  }

  onDateSelected() {
    this.showDatePicker = false;
    this.plannerService.addPlannerByDate(
      new PlannerByDate(
        transformDate(new Date(this.dateExampleStart)),
        transformDate(new Date(this.dateExampleEnd))
      )
    );
  }

  onDelete(planner: PlannerByDate) {
    this.plannerService.removePlannerByDate(planner);
  }
}
