import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as moment from 'moment';
import { take } from 'rxjs';
import { isDateBefore } from 'src/app/pages/calendar/calendar.utils';
import { UpdateUserAction } from 'src/app/store/actions/user.actions';
import { IAppState } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

@Component({
  selector: 'app-clear-old-data',
  templateUrl: './clear-old-data.component.html',
  styleUrls: ['./clear-old-data.component.scss']
})
export class ClearOldDataComponent implements OnInit {

  isOlDataAvailable = false;
  oldDate = new Date('1/17/2024');

  constructor(private store: Store<IAppState>,) {

  }
  ngOnInit(): void {
    this.store.pipe(select(getCurrentUser)).subscribe(user => {
      this.isOlDataAvailable = !!user?.plannedRecipies?.find(recipy => isDateBefore(new Date(recipy.endTime), this.oldDate));
    })
  }

  getIsOlderThan(date: string, months: number) {
    const acceptableDateForStorage = moment().clone().subtract(months, 'M');
    return moment(date, 'DDMMYYYY').isBefore(acceptableDateForStorage)
  }

  deleteOldData() {
    this.store.pipe(select(getCurrentUser), take(1)).subscribe(user => {
      const updatedUser = {
        ...user,
        details: user!.plannedRecipies!.filter(recipy => !isDateBefore(new Date(recipy.endTime), this.oldDate))
      }
      this.store.dispatch(new UpdateUserAction(updatedUser, 'Old data deleted'))
    })
  }

}
