import { Component, computed, inject, OnInit, signal, ViewChild } from '@angular/core';
import { InfiniteScrollCustomEvent, IonModal, ModalController } from '@ionic/angular';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { FiltersService } from 'src/app/filters/services/filters.service';
import { Recipy } from 'src/app/models/recipies.models';
import { CalendarRecipyInDatabase_Reworked, RecipyForCalendar_Reworked } from '../../../../models/calendar.models';

import { getLastPreparedDate, newDateIgnoreimezone } from '../../calendar.utils';
import { RecipiesService } from 'src/app/services/recipies.service';
import { UserDataService } from 'src/app/services/user-data.service';

enum AddRecipyToCalView {
  SelectRecipy = 'select-recipy',
  SelectDate = 'select-date',
  SetAmount = 'set-amount'
}

const RECIPY_CARD_HEIGHT = 360;

@Component({
  selector: 'app-add-recipy-to-calendar-modal',
  templateUrl: './add-recipy-to-calendar-modal.component.html',
  styleUrls: ['./add-recipy-to-calendar-modal.component.scss'],
})
export class AddRecipyToCalendarModalComponent implements OnInit {
  recipiesService = inject(RecipiesService);
  filtersService = inject(FiltersService);
  userDataService = inject(UserDataService);

  $recipies = this.recipiesService.recipiesWithFilterEnabled;
  $recipiesToDisplay = computed(() => this.$recipies().filter((r, i) => i <= this.numberOfRecipiesToDisplay()))
  $isShowWidget = this.filtersService.isShowWidget;
  $userFamilyMembers = this.userDataService.userFamily;

  selectedRecipy: Recipy | null = null;
  selectedTime: Date | null = null;
  portions: number | null = null;
  portionSize: number | null = null;
  entryId: string = ''

  currentView = AddRecipyToCalView.SelectRecipy;

  AddRecipyToCalView = AddRecipyToCalView;

  isEditMode = false;

  initialSelectDate = this.selectedTime?.toISOString();

  familyMembersSub: Subscription | undefined;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    if (!this.isEditMode || !this.portions) {
      const userFamilyCount = this.$userFamilyMembers().length;
      if (userFamilyCount) {
        this.portions = userFamilyCount;
      } else { this.portions = 4; }
    }

    this.getCurrentView()

  }

  getCurrentView() {
    if (!this.selectedRecipy) {
      this.currentView = AddRecipyToCalView.SelectRecipy;
    } else if (!this.selectedTime) {
      this.currentView = AddRecipyToCalView.SelectDate;
    } else {
      this.currentView = AddRecipyToCalView.SetAmount;
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

  threshhold = RECIPY_CARD_HEIGHT * 2;
  numberOfRecipiesToDisaplyAtOnce = 3
  numberOfRecipiesToDisplay = signal(this.numberOfRecipiesToDisaplyAtOnce);

  onIonInfinite(event: any) {
    this.numberOfRecipiesToDisplay.update(current => current + this.numberOfRecipiesToDisaplyAtOnce);
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
    this.initialSelectDate = newDateIgnoreimezone(newDate).toISOString()
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
      this.userDataService.addRecipyToCalendar(recipyToAdd)
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

}
