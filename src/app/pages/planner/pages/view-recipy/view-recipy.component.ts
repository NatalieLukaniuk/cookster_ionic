import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { tap, map } from 'rxjs';
import { MealTime } from 'src/app/models/calendar.models';
import { UpdateRecipyInCalendarAction } from 'src/app/store/actions/calendar.actions';
import {
  SetIsLoadingAction,
  SetIsLoadingFalseAction,
} from 'src/app/store/actions/ui.actions';
import { IAppState } from 'src/app/store/reducers';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

@Component({
  selector: 'app-view-recipy',
  templateUrl: './view-recipy.component.html',
  styleUrls: ['./view-recipy.component.scss'],
})
export class ViewRecipyComponent implements OnInit {
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

  ngOnInit() {}

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
}
