import { Component, computed, inject } from '@angular/core';
import * as moment from 'moment';

import { isDateBefore } from 'src/app/pages/calendar/calendar.utils';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-clear-old-data',
  templateUrl: './clear-old-data.component.html',
  styleUrls: ['./clear-old-data.component.scss']
})
export class ClearOldDataComponent {
  userDataService = inject(UserDataService);

  isOlDataAvailable = computed(() => !!this.userDataService.userPlannedRecipies().find(recipy => isDateBefore(new Date(recipy.endTime), this.oldDate)));
  oldDate = new Date('1/17/2024');

  getIsOlderThan(date: string, months: number) {
    const acceptableDateForStorage = moment().clone().subtract(months, 'M');
    return moment(date, 'DDMMYYYY').isBefore(acceptableDateForStorage)
  }

  deleteOldData() {
    this.userDataService.removePlannedRecipiesOlderThan(this.oldDate)
  }

}
