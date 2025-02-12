import { Component, Input, OnInit } from '@angular/core';
import { RecipyForCalendar_Reworked } from 'src/app/models/calendar.models';

@Component({
  selector: 'app-save-calendar-as-pdf-preview',
  templateUrl: './save-calendar-as-pdf-preview.component.html',
  styleUrls: ['./save-calendar-as-pdf-preview.component.scss'],
})
export class SaveCalendarAsPdfPreviewComponent  implements OnInit {
  recipies: RecipyForCalendar_Reworked[] = [];

  constructor() { }

  ngOnInit() {
    debugger
  }

}
