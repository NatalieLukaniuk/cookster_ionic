import {
  Component,
  Input,
  EventEmitter,
  Output,
  SimpleChanges,
  OnChanges,
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

@Component({
  selector: 'app-advance-preparation',
  templateUrl: './advance-preparation.component.html',
  styleUrls: ['./advance-preparation.component.scss'],
})
export class AdvancePreparationComponent implements OnChanges {
  @Input() day!: Day;

  prepListItems: Reminder[] = [];

  currentUser: User | undefined;
  @Output() hasTimedOutPreps = new EventEmitter();

  constructor(private store: Store, private dialog: DialogsService) {
    this.store.pipe(select(getCurrentUser)).subscribe((res) => {
      if (res) {
        this.currentUser = res;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['day'].currentValue) {
      this.buildPrepList();
    }
  }

  buildPrepList() {
    this.prepListItems = [];
    if (this.currentUser && this.currentUser.savedPreps?.length) {
      this.currentUser.savedPreps.forEach((reminderItem: Reminder) => {
        if (reminderItem.calendarDay=== this.day.details.day) {
          this.prepListItems.push(reminderItem);
        }
      });
    }
    // this.checkTimePassed();
  }

  hasDoneItems(): boolean {
    return !!this.prepListItems?.find((suggestion) => suggestion.done);
  }

  hasIncomplete() {
    return !!this.prepListItems?.find((suggestion) => !suggestion.done);
  }

  isTimePassed(suggestion: Reminder) {
    // FIXME: needs implementation
    // if(suggestion.time){
    //   let currentDay = moment();
    //   if(currentDay.isBefore(this.day.value, 'date')){
    //     return false
    //   } else if(currentDay.isAfter(this.day.value, 'date')){
    //     return true
    //   } else {
    //     let timeNow = moment().hour().toString() + moment().minutes().toString()
    //     let formattedSuggestionTime = suggestion.time.split(':')[0] + suggestion.time.split(':')[1]
    //     return +timeNow > +formattedSuggestionTime
    //   }
    // } else
    return false;
  }

  checkTimePassed() {
    let hasPassed = !!this.prepListItems.find(
      (sugg) => this.isTimePassed(sugg) && !sugg.done
    );
    this.hasTimedOutPreps.emit(hasPassed);
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
