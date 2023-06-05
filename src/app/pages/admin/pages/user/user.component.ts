import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as moment from 'moment';
import { take } from 'rxjs';
import { UpdateUserAction } from 'src/app/store/actions/user.actions';
import { IAppState } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  isOlDataAvailable = false;
  numberOfMonthsToStore = 3;

  constructor(private store: Store<IAppState>,) {

  }
  ngOnInit(): void {
    this.store.pipe(select(getCurrentUser)).subscribe(user => {
      this.isOlDataAvailable = !!user?.details?.find(day => this.getIsOlderThan(day.day, 3));
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
        details: user!.details!.filter(day => !this.getIsOlderThan(day.day, this.numberOfMonthsToStore))
      }
      debugger
      this.store.dispatch(new UpdateUserAction(updatedUser, 'Old data deleted'))
    })
  }

}
