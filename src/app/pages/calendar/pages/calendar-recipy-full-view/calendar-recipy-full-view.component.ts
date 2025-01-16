import { MealTime } from 'src/app/models/calendar.models';
import {
  UpdateRecipyInCalendarAction,
} from './../../../../store/actions/calendar.actions';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { tap, map, take, combineLatest, filter } from 'rxjs';
import {
  SetIsLoadingAction,
  SetIsLoadingFalseAction,
} from 'src/app/store/actions/ui.actions';
import { IAppState } from 'src/app/store/reducers';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { transfromMomentToDate } from 'src/app/calendar/calendar.utils';

@Component({
  selector: 'app-calendar-recipy-full-view',
  templateUrl: './calendar-recipy-full-view.component.html',
  styleUrls: ['./calendar-recipy-full-view.component.scss'],
})
export class CalendarRecipyFullViewComponent {
  recipyId: string;

  recipy$ = this.store.pipe(
    select(getAllRecipies),
    tap(() => this.store.dispatch(new SetIsLoadingAction())),
    map((res) => res.find((recipy) => recipy.id === this.recipyId)),
    map((recipy) => {
      if (recipy && recipy.ingrediends) {
        let updatedRecipy = _.cloneDeep(recipy);
        updatedRecipy.ingrediends.sort((a, b) => b.amount - a.amount);
        this.store.dispatch(new SetIsLoadingFalseAction());
        return updatedRecipy;
      } else return recipy;
    })
  );

  user$ = this.store.pipe(select(getCurrentUser));

  isOwnRecipy$ = combineLatest([this.user$, this.recipy$]).pipe(
    filter((res) => !!res[0] && !!res[1]),
    map((res) => res[0]?.email === res[1]?.author)
  );

  portions$ = this.route.queryParams.pipe(
    tap((res) => {
      this.mealtime = res['mealtime'];
      this.day = res['day'];
    }),
    map((res) => res['portions'])
  );
  amountPerPortion$ = this.route.queryParams.pipe(
    map((res) => res['amountPerPortion'])
  );

  mealtime: MealTime | undefined;
  day: string | undefined;

  constructor(
    private store: Store<IAppState>,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const path = window.location.pathname.split('/');
    this.recipyId = path[path.length - 1];
  }


  onPortionsChanged(event: { portions: number; amountPerPortion: number }) {
    const queryParams: Params = {
      portions: event.portions,
      amountPerPortion: event.amountPerPortion,
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });

    if (this.mealtime && this.day) {
      this.store.dispatch(
        new UpdateRecipyInCalendarAction(
          this.recipyId,
          this.day,
          this.mealtime,
          event.portions,
          event.amountPerPortion
        )
      );
    }
  }

  getDay() {
    if (this.day) {
      return new Date(transfromMomentToDate(this.day));
    } else {
      return new Date()
    }
  }

  goEditRecipy() {
    this.router.navigate(['tabs', 'recipies', 'edit-recipy', this.recipyId]);
  }
}
