import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { RecipyForCalendar_Reworked } from '../../../../models/calendar.models';
import { DishType } from 'src/app/models/recipies.models';
import { CalendarService } from 'src/app/pages/calendar/calendar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { iSameDay } from '../../calendar.utils';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-recipy-preview',
  templateUrl: './recipy-preview.component.html',
  styleUrls: ['./recipy-preview.component.scss'],
})
export class RecipyPreviewComponent implements OnInit {
  userDataService = inject(UserDataService);
  
  @Input() recipy!: RecipyForCalendar_Reworked;
  @Output() closePopover = new EventEmitter<void>();
  @Output() editClicked = new EventEmitter<RecipyForCalendar_Reworked>()

  Math = Math;
  DishType = DishType;
  showNeedsAdvancePreparation: boolean = false;

  constructor(
    private calendarService: CalendarService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.showNeedsAdvancePreparation = this.recipy.type.includes(
      DishType['потребує попередньої підготовки']
    );

  }

  get recipyIngredients() {
    return this.recipy.ingrediends.map(ingred => ingred.ingredient)
  }

  get recipyPrep() {
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
    this.userDataService.removeRecipyFromCalendar(this.recipy)
  }

  getIsOverflowing(): boolean{
    return !this.recipy.prepStart ? false : !iSameDay(new Date(this.recipy.prepStart), new Date(this.recipy.endTime))
  }

  getFormatting() {
    return this.getIsOverflowing() ? 'EEE, dd.MM, HH:mm' : 'HH:mm'
  }

}
