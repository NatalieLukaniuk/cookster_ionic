import {
  Component,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Store, select } from '@ngrx/store';

import * as _ from 'lodash';
import { User } from 'src/app/models/auth.models';
import { Day, Reminder } from 'src/app/models/calendar.models';
import {
  MeasuringUnit,
  MeasuringUnitText,
} from 'src/app/models/recipies.models';
import { DialogsService } from 'src/app/services/dialogs.service';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import * as UserActions from './../../../../store/actions/user.actions';
import * as moment from 'moment';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-advance-preparation',
  templateUrl: './advance-preparation.component.html',
  styleUrls: ['./advance-preparation.component.scss'],
})
export class AdvancePreparationComponent implements OnDestroy {
  @Input() day!: Day;

  @Input() prepListItems: Reminder[] = [];

  currentUser: User | undefined;

  destroy$ = new Subject<void>();

  constructor(private store: Store, private dialog: DialogsService) {
    this.store.pipe(select(getCurrentUser), takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        this.currentUser = res;
      }
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next()
  }

  isTimePassed(reminder: Reminder) {
    if (reminder.fullDate) {
      let now = new Date();
      if (moment(now).isAfter(moment(reminder.fullDate))) {
        return true
      } else {
        return false
      }
    } else return false;
  }

  getUnitText(unit: MeasuringUnit) {
    return MeasuringUnitText[unit];
  }

  markAsDone(prep: Reminder) {
    this.dialog
      .openConfirmationDialog(
        `Видалити ${prep.description}?`,
        'Ця дія незворотня'
      )
      .then((res) => {
        if (res.role === 'confirm' && this.currentUser) {
          let updatedUser = _.cloneDeep(this.currentUser);
          updatedUser.savedPreps = updatedUser.savedPreps?.filter(
            (item) =>
              !(
                item.description === prep.description
              )
          );
          this.store.dispatch(
            new UserActions.UpdateUserAction(
              updatedUser,
              `${prep.description} видалено`
            )
          );
        } else {
          this.closeSlidingItem()
        }
      });
  }

  @ViewChild('slidingContainer') slidingContainer: any;

  closeSlidingItem() {
    this.slidingContainer.close()
  }
}
