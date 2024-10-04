import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RecipyForCalendar_Reworked } from '../calendar.models';
import { DishType } from 'src/app/models/recipies.models';
import { CalendarService } from 'src/app/pages/calendar/calendar.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipy-preview',
  templateUrl: './recipy-preview.component.html',
  styleUrls: ['./recipy-preview.component.scss'],
})
export class RecipyPreviewComponent implements OnInit {
  @Input() recipy!: RecipyForCalendar_Reworked;
  @Output() closePopover = new EventEmitter<void>();

  Math = Math;
  DishType = DishType;
  showNeedsAdvancePreparation: boolean = false;
  constructor(
    private calendarService: CalendarService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.showNeedsAdvancePreparation = this.recipy.type.includes(
      DishType['потребує попередньої підготовки']
    );
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

  onChangeRecipyDate() { }

  onDelete() { }

}
