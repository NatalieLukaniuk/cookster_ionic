import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { LoadCalendarAction } from 'src/app/store/actions/calendar.actions';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { User } from '../models/auth.models';
import {
  CalendarRecipyInDatabase,
  Day,
  DayDetails,
  DayDetailsExtended,
  IDayDetails,
  RecipyForCalendar,
} from '../models/calendar.models';
import { Recipy } from '../models/recipies.models';
import { UpdateUserAction } from '../store/actions/user.actions';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  constructor(private store: Store) {}

  saveRecipyToCalendar(
    userToSave: User,
    day: string,
    recipyId: string,
    mealTime: string,
    portions: number,
    amountPerPortion: number
  ) {
    if (!('details' in userToSave)) {
      userToSave.details = [];
    }
    let dayExists = userToSave.details?.find((item) => item.day == day);
    if (!!dayExists) {
      userToSave.details = userToSave.details!.map((item: any) => {
        if (item.day == day) {
          switch (mealTime) {
            case 'breakfast':
              {
                if (!('breakfast' in item)) {
                  item.breakfast = [];
                }
                item.breakfast.push({ recipyId, portions, amountPerPortion });
              }
              break;
            case 'lunch':
              {
                if (!('lunch' in item)) {
                  item.lunch = [];
                }
                item.lunch.push({ recipyId, portions, amountPerPortion });
              }
              break;
            case 'dinner': {
              if (!('dinner' in item)) {
                item.dinner = [];
              }
              item.dinner.push({ recipyId, portions, amountPerPortion });
            }
          }
        }
        return item;
      });
      this.store.dispatch(
        new UpdateUserAction(userToSave, `${recipyId} збережено для ${day}`)
      );
    } else if (!!day) {
      let itemToSave: DayDetails = new DayDetails(day, []);
      switch (mealTime) {
        case 'breakfast':
          itemToSave.breakfast.push({ recipyId, portions, amountPerPortion });
          break;
        case 'lunch':
          itemToSave.lunch.push({ recipyId, portions, amountPerPortion });
          break;
        case 'dinner':
          itemToSave.dinner.push({ recipyId, portions, amountPerPortion });
      }
      userToSave.details!.push(itemToSave);
      this.store.dispatch(
        new UpdateUserAction(userToSave, `${recipyId} збережено для ${day}`)
      );
    }
  }

  updateDay(userToSave: User, updatedDetails: IDayDetails) {
    let details;
    if (
      !updatedDetails.breakfast.length &&
      !updatedDetails.dinner.length &&
      !updatedDetails.lunch.length
    ) {
      details = userToSave.details?.filter(
        (item) => item.day !== updatedDetails.day
      );
    } else {
      details = userToSave.details?.map((item) => {
        if (item.day == updatedDetails.day) {
          return updatedDetails;
        } else return item;
      });
    }

    let updatedUser = {
      ...userToSave,
      details: details,
    };
    this.store.dispatch(
      new UpdateUserAction(updatedUser, `${updatedDetails.day} оновлено`)
    );
  }

  generateInRange(start: string, end: string): Day[] {
    // format: YYYYMMDD

    const startDay = moment(start).subtract(1, 'day');
    const endDay = moment(end).add(1, 'day');
    const date = startDay.clone();

    const calendar: Day[] = [];
    const currentDay = moment().subtract(1, 'day');
    while (date.isBefore(endDay, 'day')) {
      const value = date.add(1, 'day').clone();
      const active = moment().isSame(value, 'date');
      const disabled = value.isBefore(currentDay);
      const selected = value.isSame(currentDay);
      let det = new DayDetails(value.format('DDMMYYYY'), []);
      const details: DayDetailsExtended = {
        ...det,
        breakfastRecipies: [],
        lunchRecipies: [],
        dinnerRecipies: [],
      };
      calendar.push({ value, active, disabled, selected, details });
    }
    return calendar;
  }

  generateForDates(dates: string[]): Day[] {
    // format: YYYYMMDD
    const calendar: Day[] = [];
    const currentDay = moment().subtract(1, 'day');
    for (const date of dates) {
      const momentDate = moment(date).subtract(1, 'day');
      const value = momentDate.add(1, 'day').clone();
      const active = moment().isSame(value, 'date');
      const disabled = value.isBefore(currentDay);
      const selected = value.isSame(currentDay);
      let det = new DayDetails(value.format('DDMMYYYY'), []);
      const details: DayDetailsExtended = {
        ...det,
        breakfastRecipies: [],
        lunchRecipies: [],
        dinnerRecipies: [],
      };
      calendar.push({ value, active, disabled, selected, details });
    }    
    return calendar;
  }

  buildCalendarForDates(
    dates: string[],
    userCalendarData: DayDetails[],
    allRecipies: Recipy[]
  ) {
    let calendar = this.generateForDates(dates);

    calendar = calendar.map((day: Day) => {
      let foundDay = userCalendarData.find(
        (item: IDayDetails) => item.day == day.details.day
      );
      if (!!foundDay) {
        return this.buildDay(foundDay, day, allRecipies);
      } else return day;
    });
    this.store.dispatch(new LoadCalendarAction(calendar));
  }

  buildCalendarInRange(
    start: string,
    end: string,
    userCalendarData: DayDetails[],
    allRecipies: Recipy[]
  ) {
    let calendar = this.generateInRange(start, end);

    calendar = calendar.map((day: Day) => {
      let foundDay = userCalendarData.find(
        (item: IDayDetails) => item.day == day.details.day
      );
      if (!!foundDay) {
        return this.buildDay(foundDay, day, allRecipies);
      } else return day;
    });
    this.store.dispatch(new LoadCalendarAction(calendar));
  }

  buildDay(
    dayFromDb: DayDetails,
    calendarDay: Day,
    allRecipies: Recipy[]
  ): Day {
    let _day = _.cloneDeep(calendarDay);

    if ('breakfast' in dayFromDb && !!dayFromDb.breakfast.length) {
      dayFromDb.breakfast.forEach((rec: CalendarRecipyInDatabase) => {
        let foundRecipy = allRecipies.find(
          (recipy) => recipy.id == rec.recipyId
        );
        if (foundRecipy) {
          let recipy: RecipyForCalendar = {
            ...foundRecipy,
            portions: rec.portions,
            amountPerPortion: rec.amountPerPortion,
          };
          _day.details.breakfastRecipies.push(recipy);
        }
      });
    }
    if ('lunch' in dayFromDb && !!dayFromDb.lunch.length) {
      dayFromDb.lunch.forEach((rec: CalendarRecipyInDatabase) => {
        let foundRecipy = allRecipies.find(
          (recipy) => recipy.id == rec.recipyId
        );
        if (foundRecipy) {
          let recipy: RecipyForCalendar = {
            ...foundRecipy,
            portions: rec.portions,
            amountPerPortion: rec.amountPerPortion,
          };
          _day.details.lunchRecipies.push(recipy);
        }
      });
    }
    if ('dinner' in dayFromDb && !!dayFromDb.dinner.length) {
      dayFromDb.dinner.forEach((rec: CalendarRecipyInDatabase) => {
        let foundRecipy = allRecipies.find(
          (recipy) => recipy.id == rec.recipyId
        );
        if (foundRecipy) {
          let recipy: RecipyForCalendar = {
            ...foundRecipy,
            portions: rec.portions,
            amountPerPortion: rec.amountPerPortion,
          };
          _day.details.dinnerRecipies.push(recipy);
        }
      });
    }
    return _day;
  }

  getRecipiesAndBuildDay(
    dayFromDb: DayDetails,
    calendarDay: Day
  ): Observable<Day> {
    return new Observable((observer) => {
      this.store.pipe(select(getAllRecipies), take(1)).subscribe((recipies) => {
        if (recipies) {
          let result = this.buildDay(dayFromDb, calendarDay, recipies);
          observer.next(result);
        }
      });
    });
  }
}
