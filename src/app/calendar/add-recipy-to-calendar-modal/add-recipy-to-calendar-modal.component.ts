import { Component, OnInit, ViewChild } from '@angular/core';
import { InfiniteScrollCustomEvent, IonModal } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import * as _ from 'lodash';
import * as moment from 'moment';
import { combineLatest, take, map, tap } from 'rxjs';
import { FiltersService } from 'src/app/filters/services/filters.service';
import { IDayDetails } from 'src/app/models/calendar.models';
import { DishType, Recipy } from 'src/app/models/recipies.models';
import { CalendarService } from 'src/app/services/calendar.service';
import { DataMappingService } from 'src/app/services/data-mapping.service';
import { IAppState } from 'src/app/store/reducers';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { getUserPlannedRecipies } from 'src/app/store/selectors/user.selectors';

enum AddRecipyToCalView {
  SelectRecipy = 'select-recipy',
  SelectDate = 'select-date',
  SetAmount = 'set-amount'
}

@Component({
  selector: 'app-add-recipy-to-calendar-modal',
  templateUrl: './add-recipy-to-calendar-modal.component.html',
  styleUrls: ['./add-recipy-to-calendar-modal.component.scss'],
})
export class AddRecipyToCalendarModalComponent implements OnInit {

  selectedRecipy: Recipy | null = null;
  selectedTime: Date | null = null;
  portions: number | null = null;
  portionSize: number | null = null;

  currentView = AddRecipyToCalView.SelectRecipy;

  AddRecipyToCalView = AddRecipyToCalView;

  constructor(
    private store: Store<IAppState>,
    private datamapping: DataMappingService,
    private filtersService: FiltersService,
    private calendarService: CalendarService
  ) { }

  ngOnInit() { }

  @ViewChild(IonModal) modal: IonModal | undefined;

  cancel() {
    this.modal?.dismiss(null, 'cancel');
  }

  get isValid() {
    return !!this.selectedRecipy && !!this.selectedTime && !!this.portions && !!this.portionSize
  }

  changeCurrentView(view: AddRecipyToCalView) {
    this.currentView = view;
  }

  filters$ = this.filtersService.getFilters;

  recipies: Recipy[] = [];

  recipies$ = combineLatest([
    this.store.pipe(select(getAllRecipies), take(1)),
    this.filters$,
    this.store.pipe(select(getUserPlannedRecipies)),
    this.filtersService.noShowRecipies$
  ]).pipe(
    map((res) => {
      let [recipies, filters, plannedRecipies, noShowIds] = res;
      const clonedRecipies = _.cloneDeep(recipies);
      const filtered = this.filtersService.applyFilters(clonedRecipies, filters, noShowIds);
      const mapped = filtered.map(recipy => this.addLastPrepared(recipy, plannedRecipies));
      const sorted = this.getSortedByLastPrepared(mapped);
      return sorted
    }),
    tap(recipies => this.recipies = recipies)
  );

  getSortedByLastPrepared(recipies: Recipy[]) {
    const cloned = _.cloneDeep(recipies);
    cloned.sort((a, b) => this.sortByLastPrepared(a, b));
    return cloned
  }

  sortByLastPrepared(a: Recipy, b: Recipy) {
    if (!a.lastPrepared && !b.lastPrepared) {
      return 0
    }
    if (!a.lastPrepared) {
      return -1
    }
    if (!b.lastPrepared) {
      return 1
    }
    if (moment(a.lastPrepared, 'DDMMYYYY').clone().isAfter(moment(b.lastPrepared, 'DDMMYYYY').clone())) {
      return 1
    } else {
      return -1
    }
  }

  addLastPrepared(recipy: Recipy, allPlannedRecipies: IDayDetails[] | undefined) {
    let updated = {
      ...recipy,
      lastPrepared: allPlannedRecipies ? this.calendarService.getLastPreparedDate(recipy.id, allPlannedRecipies) : 'N/A'
    }
    return updated
  }

  showGoTop = false;

  numberOfRecipiesToDisplay = 10;

  onIonInfinite(event: any) {
    this.numberOfRecipiesToDisplay += 10;
    (event as InfiniteScrollCustomEvent).target.complete();
  }

  onscroll(event: any) {
    this.showGoTop = event.detail.scrollTop > 500;
  }

  @ViewChild('scrollingContainer') scrollingContainer: any;

  goTop() {
    this.scrollingContainer.scrollToTop()
  }

  onRecipyClicked(recipy: Recipy) {
    this.selectedRecipy = recipy;
  }

}