import { RecipyForCalendar_Reworked } from './../calendar.models';
import { Component, Input, OnInit } from '@angular/core';

const MINUTES_IN_PIXEL = 1;

const HOURS_IN_DAY = 24;

@Component({
  selector: 'app-calendar-timeline-day',
  templateUrl: './calendar-timeline-day.component.html',
  styleUrls: ['./calendar-timeline-day.component.scss'],
})
export class CalendarTimelineDayComponent implements OnInit {
  PIXELS_IN_DAY = (HOURS_IN_DAY * 60) / MINUTES_IN_PIXEL;

  @Input() recipies: RecipyForCalendar_Reworked[] | null = []

  timelineScaleItems = Array.from({ length: HOURS_IN_DAY }, (v, i) => i)

  constructor() { }

  ngOnInit() { }

  getRecipyTopMargin(recipy: RecipyForCalendar_Reworked) {    
    const minutesTillEndTime = (new Date(recipy.endTime).getHours() * 60) + new Date(recipy.endTime).getMinutes();
    const startTime = minutesTillEndTime - this.getRecipyHeight(recipy);
    if (startTime > 0) {
      return startTime / MINUTES_IN_PIXEL
    } else {
      return 0
    }
  }

  getRecipyHeight(recipy: RecipyForCalendar_Reworked): number {
    let time = 0;
    for (let step of recipy.steps) {
      time = time + +step.timeActive + +step.timePassive;
    }
    return time / MINUTES_IN_PIXEL;
  }

}
