import { SetIsLoadingFalseAction } from './../../../../store/actions/ui.actions';
import { filter, map, tap } from 'rxjs/operators';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { Store, select } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { IAppState } from 'src/app/store/reducers';
import { SetIsLoadingAction } from 'src/app/store/actions/ui.actions';

@Component({
  selector: 'app-full-recipy-page',
  templateUrl: './full-recipy-page.component.html',
  styleUrls: ['./full-recipy-page.component.scss'],
})
export class FullRecipyPageComponent implements OnInit {

  recipyId: string;

  recipy$ = this.store.pipe(
    select(getAllRecipies),
    tap(() => this.store.dispatch(new SetIsLoadingAction())),
    map(res => res.find(recipy => recipy.id === this.recipyId)),
    tap(res => this.store.dispatch(new SetIsLoadingFalseAction()))
    )

  constructor(private store: Store<IAppState>) { 
    const path = window.location.pathname.split('/');
    this.recipyId = path[path.length - 1];
  }

  ngOnInit() {
    
    
  }

}
