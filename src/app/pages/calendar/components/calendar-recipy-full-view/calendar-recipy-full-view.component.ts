import { UpdateRecipyInCalendarActionNew } from '../../../../store/actions/calendar.actions';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { tap, map, take, combineLatest, filter, pipe } from 'rxjs';
import {
  SetIsLoadingAction,
  SetIsLoadingFalseAction,
} from 'src/app/store/actions/ui.actions';
import { IAppState } from 'src/app/store/reducers';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { getCurrentUser, getUserPlannedRecipies } from 'src/app/store/selectors/user.selectors';
import { RecipyForCalendar_Reworked } from 'src/app/models/calendar.models';

@Component({
  selector: 'app-calendar-recipy-full-view',
  templateUrl: './calendar-recipy-full-view.component.html',
  styleUrls: ['./calendar-recipy-full-view.component.scss'],
})
export class CalendarRecipyFullViewComponent {
  entryId: string;

  currentRecipy: RecipyForCalendar_Reworked | undefined;
  currentPortions: number = 0;
  currentAmountPerPortion: number = 0;

  recipy$ = combineLatest([
    this.store.pipe(select(getAllRecipies)),
    this.store.pipe(select(getUserPlannedRecipies)),
  ]).pipe(
    tap(() => this.store.dispatch(new SetIsLoadingAction())),
    map((res) => {
      const foundInPlanned = res[1]?.find((plannedRecipy) => plannedRecipy.entryId === this.entryId);
      if (foundInPlanned) {
        const matched = res[0].find(recipy => recipy.id === foundInPlanned.recipyId);
        if (matched) {
          return {
            ...matched,
            ...foundInPlanned
          }
        } else {
          return undefined
        }
      } else {
        return undefined
      }
    }),
    tap(recipy => this.currentRecipy = recipy),
    map((recipy) => {
      if (recipy && recipy.ingrediends) {
        let updatedRecipy = _.cloneDeep(recipy);
        updatedRecipy.ingrediends.sort((a, b) => b.amount - a.amount);
        this.store.dispatch(new SetIsLoadingFalseAction());
        return updatedRecipy;
      } else return recipy;
    })
  )


  user$ = this.store.pipe(select(getCurrentUser));

  isOwnRecipy$ = combineLatest([this.user$, this.recipy$]).pipe(
    filter((res) => !!res[0] && !!res[1]),
    map((res) => res[0]?.email === res[1]?.author)
  );

  portions$ = this.route.queryParams.pipe(
    map((res) => res['portions']),
    tap(res => this.currentPortions = res)
  );
  amountPerPortion$ = this.route.queryParams.pipe(
    map((res) => res['amountPerPortion']),
    tap(res => this.currentAmountPerPortion = res)
  );

  constructor(
    private store: Store<IAppState>,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const path = window.location.pathname.split('/');
    this.entryId = path[path.length - 1];
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
    if (this.currentRecipy) {
      this.store.dispatch(
        new UpdateRecipyInCalendarActionNew(
          {
            ...this.currentRecipy,
            portions: this.currentPortions,
            amountPerPortion: this.currentAmountPerPortion
          },
          {
            ...this.currentRecipy,
            portions: event.portions,
            amountPerPortion: event.amountPerPortion
          }
        )
      );
    }


  }

  goEditRecipy() {
    this.router.navigate(['tabs', 'recipies', 'edit-recipy', this.currentRecipy?.id]);
  }


}
