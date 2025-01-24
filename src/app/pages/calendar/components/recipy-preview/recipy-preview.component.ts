import { RemoveRecipyFromCalendarActionNew } from '../../../../store/actions/calendar.actions';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RecipyForCalendar_Reworked } from '../../../../models/calendar.models';
import { DishType } from 'src/app/models/recipies.models';
import { CalendarService } from 'src/app/pages/calendar/calendar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IAppState } from 'src/app/store/reducers';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-recipy-preview',
  templateUrl: './recipy-preview.component.html',
  styleUrls: ['./recipy-preview.component.scss'],
})
export class RecipyPreviewComponent implements OnInit {
  @Input() recipy!: RecipyForCalendar_Reworked;
  @Output() closePopover = new EventEmitter<void>();
  @Output() editClicked = new EventEmitter<RecipyForCalendar_Reworked>()

  Math = Math;
  DishType = DishType;
  showNeedsAdvancePreparation: boolean = false;
  constructor(
    private calendarService: CalendarService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<IAppState>,
  ) { }

  ngOnInit() {
    this.showNeedsAdvancePreparation = this.recipy.type.includes(
      DishType['потребує попередньої підготовки']
    );
  }

  get recipyIngredients(){
    return this.recipy.ingrediends.map(ingred => ingred.ingredient)
  }

  get recipyPrep(){
    return this.recipy.steps.map(step => step.description)
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

  viewRecipy() {
    this.calendarService.openRecipy(this.recipy);
    this.router.navigate(['view-recipies'], {
      relativeTo: this.route,
    });
    this.closePopover.emit()
  }

  onEditRecipy() {
    this.closePopover.emit();
    this.editClicked.emit(this.recipy);
   }

  onDelete() {
    this.store.dispatch(new RemoveRecipyFromCalendarActionNew(this.recipy))
   }

}
