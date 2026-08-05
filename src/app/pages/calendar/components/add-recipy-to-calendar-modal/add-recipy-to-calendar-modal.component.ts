import { Component, computed, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { InfiniteScrollCustomEvent, IonModal, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { FiltersService } from 'src/app/filters/services/filters.service';
import { Recipy } from 'src/app/models/recipies.models';
import { CalendarRecipyInDatabase_Reworked, RecipyForCalendar_Reworked } from '../../../../models/calendar.models';

import { getLastPreparedDate, newDateIgnoreimezone } from '../../calendar.utils';
import { RecipiesService } from 'src/app/services/recipies.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { DataMappingService } from 'src/app/services/data-mapping.service';
import { isDrinkOrSoup } from 'src/app/pages/recipies/utils/recipy.utils';
import { formatDate } from '@angular/common';

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
  datamapping = inject(DataMappingService)

  $recipies = this.recipiesService.recipiesWithFilterEnabled;
  $recipiesToDisplay = computed(() => this.$recipies().filter((r, i) => i <= this.numberOfRecipiesToDisplay()))
  $isShowWidget = this.filtersService.isShowWidget;
  $userFamilyMembers = this.userDataService.userFamily;

  selectedRecipy = signal<Recipy | null>(null);
  selectedTime = signal<Date>(new Date());
  portions = signal<number | null>(null);
  portionSize = signal<number | null>(null);
  entryId: string = ''

  selectedTimeToDisplay = computed(() =>{ 
    const selected = this.selectedTime();
    if(selected){
      return formatDate(selected, 'EEE, dd MMM yyyy, HH:mm', 'en-US')
    } else {
      return '-'
    }
    
  })

  coeficient = computed(() => {
    const portions = this.portions();
    const portionSize = this.portionSize();
    const selectedRecipy = this.selectedRecipy()

    if (selectedRecipy && portions && portionSize) {
      return this.datamapping.getCoeficient(
        selectedRecipy.ingrediends,
        portions,
        portionSize,
        isDrinkOrSoup(selectedRecipy)
      )
    } else {
      return 1
    }

  });

  currentView = AddRecipyToCalView.SelectRecipy;

  AddRecipyToCalView = AddRecipyToCalView;

  isEditMode = false;

  initialSelectDate = computed(() => newDateIgnoreimezone(this.selectedTime().toString()).toISOString());

  familyMembersSub: Subscription | undefined;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    if (!this.isEditMode || !this.portions()) {
      const userFamilyCount = this.$userFamilyMembers().length;
      if (userFamilyCount) {
        this.portions.set(userFamilyCount);
      } else { this.portions.set(4); }
    }

    this.getCurrentView()

  }

  getCurrentView() {
    if (!this.selectedRecipy()) {
      this.currentView = AddRecipyToCalView.SelectRecipy;
    } else if (!this.selectedTime()) {
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

  changeCurrentView(view: AddRecipyToCalView) {
    this.currentView = view;
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
    this.selectedRecipy.set(recipy);
    this.portionSize.set(recipy.portionSize || 300);
  }

  onDateChanged(newDate: string) {
    this.selectedTime.set(new Date(newDate));
  }

  onAmountSelected(event: number) {
    this.portionSize.set(event);
  }

  onPortionsSelected(event: number) {
    this.portions.set(event);
  }

 isAddDisabled = computed(() => {
    return !(!!this.portions() && !!this.portionSize() && !!this.selectedRecipy() && !!this.selectedTime())
  })

  saveButtonText = computed(() => {
    return !this.selectedRecipy() ? 'Виберіть рецепт' :
      !this.selectedTime() ? 'Вкажіть час' :
        !this.portions() ? 'Вкажіть кількість порцій' :
          !this.portionSize() ? 'Вкажіть розмір порції' :
            this.isEditMode ? 'Зберегти' : 'Додати'
  })

  addRecipyToCalendar() {
    const portions = this.portions();
    const portionSize = this.portionSize();
    const endTime = this.selectedTime();
    const selectedRecipy = this.selectedRecipy()
    if (!!portions && !!portionSize && !!selectedRecipy && !!endTime) {
      let recipyToAdd: RecipyForCalendar_Reworked = {
        ...selectedRecipy,
        portions,
        amountPerPortion: portionSize,
        endTime,
        entryId: crypto.randomUUID()
      }
      this.userDataService.addRecipyToCalendar(recipyToAdd)
      this.modal?.dismiss()
    }

  }

  saveUpdatedRecipyToCalendar() {
    const portions = this.portions();
    const portionSize = this.portionSize();
    const endTime = this.selectedTime();
    const selectedRecipy = this.selectedRecipy()
    if (!!portions && !!portionSize && !!selectedRecipy && !!endTime) {
      let updatedRecipy: RecipyForCalendar_Reworked = {
        ...selectedRecipy,
        portions,
        amountPerPortion: portionSize,
        endTime,
        entryId: this.entryId
      }
      return this.modalCtrl.dismiss(updatedRecipy, 'confirm');
    } else {
      return null;
    }


  }

}
