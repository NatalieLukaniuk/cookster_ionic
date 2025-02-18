import { Component, Input, OnInit } from '@angular/core';
import { RecipyForCalendar_Reworked } from 'src/app/models/calendar.models';
import { iSameDay } from '../../../calendar.utils';

@Component({
  selector: 'app-calendar-pdf-preview-short-recipy',
  templateUrl: './calendar-pdf-preview-short-recipy.component.html',
  styleUrls: ['./calendar-pdf-preview-short-recipy.component.scss'],
})
export class CalendarPdfPreviewShortRecipyComponent implements OnInit {
  @Input() recipy!: RecipyForCalendar_Reworked;
  constructor() { }

  Math = Math;

  ngOnInit() { }
  getIsOverflowing(): boolean {
    return !this.recipy.prepStart ? false : !iSameDay(new Date(this.recipy.prepStart), new Date(this.recipy.endTime))
  }

  getFormatting() {
    return this.getIsOverflowing() ? 'EEE, dd.MM, HH:mm' : 'HH:mm'
  }
}
