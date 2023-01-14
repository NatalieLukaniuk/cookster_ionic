import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { tap, map } from 'rxjs';
import { SetIsLoadingAction, SetIsLoadingFalseAction } from 'src/app/store/actions/ui.actions';
import { IAppState } from 'src/app/store/reducers';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

@Component({
  selector: 'app-calendar-recipy-full-view',
  templateUrl: './calendar-recipy-full-view.component.html',
  styleUrls: ['./calendar-recipy-full-view.component.scss']
})
export class CalendarRecipyFullViewComponent implements OnInit {
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

  portions$ = this.route.queryParams.pipe(map(res => res['portions']));
  amountPerPortion$ = this.route.queryParams.pipe(map(res => res['amountPerportion']));

  constructor(private store: Store<IAppState>, private route: ActivatedRoute) {
    const path = window.location.pathname.split('/');
    this.recipyId = path[path.length - 1];
   }

  ngOnInit() {
    
  }

}
