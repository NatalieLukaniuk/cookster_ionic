import { MoveRecipyInCalendarAction, RemoveRecipyFromCalendarAction } from './../../../../store/actions/calendar.actions';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  Day,
  MealTime,
  RecipyForCalendar,
} from 'src/app/models/calendar.models';
import { DishType } from 'src/app/models/recipies.models';
import { IAppState } from 'src/app/store/reducers';
import { Store } from '@ngrx/store';
import { DialogsService } from 'src/app/services/dialogs.service';

@Component({
  selector: 'app-calendar-recipy',
  templateUrl: './calendar-recipy.component.html',
  styleUrls: ['./calendar-recipy.component.scss'],
})
export class CalendarRecipyComponent implements OnInit {
  @Input() recipy!: RecipyForCalendar;
  @Input()
  day!: Day;
  @Input()
  mealtime!: MealTime;

  showNeedsAdvancePreparation: boolean = false;

  Math = Math;
  DishType = DishType;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<IAppState>,
    private dialog: DialogsService
  ) { }

  ngOnInit() {
    this.showNeedsAdvancePreparation = this.recipy.type.includes(
      DishType['потребує попередньої підготовки']
    );
  }

  viewRecipy() {
    if (window.location.pathname.includes('calendar')) {
      this.router.navigate(['recipy', this.recipy.id], {
        relativeTo: this.route,
        queryParams: {
          portions: this.recipy.portions,
          amountPerPortion: this.recipy.amountPerPortion,
          day: this.day.details.day,
          mealtime: this.mealtime,
        },
      });
    } else if (window.location.pathname.includes('planner')) {
      this.router.navigate(['tabs', 'planner', 'recipy', this.recipy.id], {
        relativeTo: this.route.parent,
        queryParams: {
          portions: this.recipy.portions,
          amountPerPortion: this.recipy.amountPerPortion,
          day: this.day.details.day,
          mealtime: this.mealtime,
        },
      });
    }
    this.closeSlidingItem();
  }

  onDelete() {
    this.dialog
      .openConfirmationDialog(
        `Видалити ${this.recipy.name}?`,
        'Ця дія незворотня'
      )
      .then((res) => {
        if (res.role === 'confirm') {
          this.store.dispatch(
            new RemoveRecipyFromCalendarAction(
              this.recipy.id,
              this.day.details.day,
              this.mealtime
            )
          );
        } else {
          this.closeSlidingItem()
        }
      });

  }

  activePreparationTime() {
    let time = 0;
    for (let step of this.recipy.steps) {
      time = time + +step.timeActive;
    }
    return time;
  }

  passivePreparationTime() {
    let time = 0;
    for (let step of this.recipy.steps) {
      time = time + +step.timePassive;
    }
    return time;
  }

  @ViewChild('slidingContainer') slidingContainer: any;

  closeSlidingItem() {
    this.slidingContainer.close()
  }

  @ViewChild('moveRecipyModal') moveRecipyModal: any;
  onChangeRecipyDate() {
    this.moveRecipyModal.modal.present();

    this.moveRecipyModal.modal.onDidDismiss().then((res: any) => {
      if (res.role === 'confirm') {
        this.moveRecipy(res.data.newDate, res.data.mealTime)
      }
    })
  }

  moveRecipy(newDate: string, newMealtime: MealTime) {
    this.store.dispatch(new MoveRecipyInCalendarAction(
      this.recipy.id,
      { day: this.day.details.day, mealtime: this.mealtime },
      { day: newDate, mealtime: newMealtime, order: 0 }))
  }
}
