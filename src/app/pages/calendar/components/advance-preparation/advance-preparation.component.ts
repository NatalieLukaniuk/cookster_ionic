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
import { ModalController } from '@ionic/angular';
import { AddReminderModalComponent } from 'src/app/shared/components/dialogs/add-reminder-modal/add-reminder-modal.component';

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

  constructor(private store: Store, private dialog: DialogsService, private modalCtrl: ModalController) {
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

  async onEditReminder(reminder: Reminder){
    const modal = await this.modalCtrl.create({
      component: AddReminderModalComponent,
      breakpoints: [0.5, 0.75],
      initialBreakpoint: 0.5,
      componentProps: {
        description: reminder.description,
        dateTime: reminder.fullDate,
        date: reminder.calendarDay
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {

      const updated: Reminder = {
        description: data.description,
        calendarDay: data.date,
        fullDate: data.fullDate,
        done: false
      }
      
      if(this.currentUser){
        const updatedUser = _.cloneDeep(this.currentUser);
        if(updatedUser.savedPreps){
          updatedUser.savedPreps = updatedUser.savedPreps.map(rem => {
            if(rem.calendarDay === reminder.calendarDay && rem.description === reminder.description){
              return updated
            } else {
              return rem;
            }
          })
        } 
        this.store.dispatch(new UserActions.UpdateUserAction(updatedUser, 'Нагадування оновлено'))
      }
    }
  }
}
