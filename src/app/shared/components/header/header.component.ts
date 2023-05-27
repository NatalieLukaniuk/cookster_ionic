import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { IAppState } from 'src/app/store/reducers';
import { getPreviousRoute } from 'src/app/store/selectors/ui.selectors';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() isShowBackButton = false;
  previousRoute: string = '';

  destroyed$ = new Subject<void>();
  constructor(private store: Store<IAppState>) {}
  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  ngOnInit() {
    this.store
      .pipe(select(getPreviousRoute), takeUntil(this.destroyed$))
      .subscribe((route) => (this.previousRoute = route));
  }
}
