import { Component, Input } from '@angular/core';
import { RecipyForCalendar_Reworked } from 'src/app/models/calendar.models';

@Component({
    selector: 'app-calendar-timeline-recipy',
    templateUrl: './calendar-timeline-recipy.component.html',
    styleUrls: ['./calendar-timeline-recipy.component.scss'],
    standalone: false
})
export class CalendarTimelineRecipyComponent {
  @Input() recipy: RecipyForCalendar_Reworked | undefined;
  

}
