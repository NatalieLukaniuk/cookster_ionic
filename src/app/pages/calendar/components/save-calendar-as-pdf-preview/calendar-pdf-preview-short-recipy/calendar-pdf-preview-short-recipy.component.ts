import { Component, Input, OnInit } from '@angular/core';
import { RecipyForCalendar_Reworked } from 'src/app/models/calendar.models';

@Component({
    selector: 'app-calendar-pdf-preview-short-recipy',
    templateUrl: './calendar-pdf-preview-short-recipy.component.html',
    styleUrls: ['./calendar-pdf-preview-short-recipy.component.scss'],
    standalone: false
})
export class CalendarPdfPreviewShortRecipyComponent implements OnInit {
  @Input() recipy!: RecipyForCalendar_Reworked;
  constructor() { }

  Math = Math;

  ngOnInit() { }
  
}
