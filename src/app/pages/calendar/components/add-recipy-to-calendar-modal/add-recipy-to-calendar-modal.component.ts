import { Component, OnInit, ViewChild } from '@angular/core';
import { InfiniteScrollCustomEvent, IonModal, ModalController } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import * as _ from 'lodash';
import * as moment from 'moment';
import { combineLatest, take, map, tap } from 'rxjs';
import { FiltersService } from 'src/app/filters/services/filters.service';
import { Recipy } from 'src/app/models/recipies.models';
import { DataMappingService } from 'src/app/services/data-mapping.service';
import { IAppState } from 'src/app/store/reducers';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { getFamilyMembers, getUserPlannedRecipies } from 'src/app/store/selectors/user.selectors';
import { CalendarRecipyInDatabase_Reworked, RecipyForCalendar_Reworked } from '../../../../models/calendar.models';
import { AddRecipyToCalendarActionNew } from 'src/app/store/actions/calendar.actions';
import { getLastPreparedDate } from '../../calendar.utils';

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
  entryId: string = ''

  currentView = AddRecipyToCalView.SelectRecipy;

  AddRecipyToCalView = AddRecipyToCalView;

  isEditMode = false;

  timeShortcuts$ = this.store.pipe(select(getUserPlannedRecipies), map(recipies => {
    if (recipies?.length) {
      const recipyTime = recipies.map(item => item.endTime).map(time => this.fixTime(new Date(time).getHours()) + ':' + this.fixTime(new Date(time).getMinutes()));
      const uniques = new Set(recipyTime);
      return Array.from(uniques)
    } else { return [] }
  }))

  fixTime(value: number) {
    if (value === 0) {
      return '00'
    } else if (value < 10) {
      return '0' + value
    } else return value.toString()
  }

  constructor(
    private store: Store<IAppState>,
    private datamapping: DataMappingService,
    private filtersService: FiltersService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {

    if (!this.isEditMode || !this.portions) {
      const sub = this.store.pipe(select(getFamilyMembers)).subscribe(res => {
        if (res) {
          this.portions = res.length;
        } else { this.portions = 4; }
        sub.unsubscribe()
      });
    }



  }

  @ViewChild(IonModal) modal: IonModal | undefined;

  cancel() {
    if (!this.isEditMode) {
      this.modal?.dismiss(null, 'cancel');
    } else {
      this.modalCtrl.dismiss(null, 'cancel')
    }

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
      const sorted = this.getSortedByLastPrepared(mapped as Recipy[]);
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

  addLastPrepared(recipy: Recipy, allPlannedRecipies: CalendarRecipyInDatabase_Reworked[] | undefined) {
    let updated = {
      ...recipy,
      lastPrepared: allPlannedRecipies ? getLastPreparedDate(recipy.id, allPlannedRecipies) : 'N/A'
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
    this.portionSize = recipy.portionSize || 300;
  }

  onDateChanged(newDate: string) {
    this.selectedTime = new Date(newDate);
  }

  onAmountSelected(event: number) {
    this.portionSize = event;
  }

  onPortionsSelected(event: number) {
    this.portions = event;
  }

  get isAddDisabled() {
    return !(!!this.portions && !!this.portionSize && !!this.selectedRecipy && !!this.selectedTime)
  }

  get saveButtonText() {
    return !this.selectedRecipy ? 'Виберіть рецепт' :
      !this.selectedTime ? 'Вкажіть час' :
        !this.portions ? 'Вкажіть кількість порцій' :
          !this.portionSize ? 'Вкажіть розмір порції' :
            this.isEditMode ? 'Зберегти' : 'Додати'
  }

  addRecipyToCalendar() {
    if (!!this.portions && !!this.portionSize && !!this.selectedRecipy && !!this.selectedTime) {
      let recipyToAdd: RecipyForCalendar_Reworked = {
        ...this.selectedRecipy,
        portions: this.portions,
        amountPerPortion: this.portionSize,
        endTime: this.selectedTime,
        entryId: crypto.randomUUID()
      }
      this.store.dispatch(new AddRecipyToCalendarActionNew(recipyToAdd));
      this.modal?.dismiss()
    }

  }

  saveUpdatedRecipyToCalendar() {
    if (!!this.portions && !!this.portionSize && !!this.selectedRecipy && !!this.selectedTime) {
      let updatedRecipy: RecipyForCalendar_Reworked = {
        ...this.selectedRecipy,
        portions: this.portions,
        amountPerPortion: this.portionSize,
        endTime: this.selectedTime,
        entryId: this.entryId
      }
      return this.modalCtrl.dismiss(updatedRecipy, 'confirm');
    } else {
      return null;
    }


  }

  changeTime(item: string) {

    if (this.selectedTime) {
      const selectedDayString = new Date(this.selectedTime).toString();
      const updated = selectedDayString.replace(/\d\d:\d\d:\d\d/gm, item + ':00')
      this.selectedTime = new Date(updated)
    }
  }

}
