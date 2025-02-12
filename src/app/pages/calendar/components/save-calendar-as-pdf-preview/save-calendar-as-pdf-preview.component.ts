import { Component, Input, OnInit } from '@angular/core';
import { RecipyForCalendar_Reworked } from 'src/app/models/calendar.models';
import { getIsNewer, iSameDay } from '../../calendar.utils';

interface TreeEl {
  [key: string]: Date | RecipyForCalendar_Reworked[]
}
interface PreviewTreeElement extends TreeEl {
  date: Date,
  breakfast: RecipyForCalendar_Reworked[],
  lunch: RecipyForCalendar_Reworked[],
  dinner: RecipyForCalendar_Reworked[]
}

@Component({
  selector: 'app-save-calendar-as-pdf-preview',
  templateUrl: './save-calendar-as-pdf-preview.component.html',
  styleUrls: ['./save-calendar-as-pdf-preview.component.scss'],
})
export class SaveCalendarAsPdfPreviewComponent implements OnInit {
  recipies: RecipyForCalendar_Reworked[] = [];

  tree: PreviewTreeElement[] = [];

  lunchStart = 11;
  dinnerStart = 16;

  constructor() { }

  ngOnInit() {
    this.recipies.forEach(recipy => {
      const foundInTree = this.tree.find(el => iSameDay(el.date, new Date(recipy.endTime)))
      const recipyTime = this.getMealTime(recipy);
      if (foundInTree) {
        (foundInTree[recipyTime] as RecipyForCalendar_Reworked[]).push(recipy)
      } else {
        const newElement: PreviewTreeElement = {
          date: new Date(recipy.endTime),
          breakfast: [],
          lunch: [],
          dinner: []
        };
        (newElement[recipyTime] as RecipyForCalendar_Reworked[]).push(recipy);
        this.tree.push(newElement)
      }
    })
    this.tree.sort((a, b) => {
      if (getIsNewer(new Date(a.date), new Date(b.date))) {
        return 1
      } else {
        return -1
      }
    })
  }

  getMealTime(recipy: RecipyForCalendar_Reworked): string {
    const recipyTime = new Date(recipy.endTime).getHours()
    if (recipyTime < this.lunchStart) {
      return 'breakfast'
    } else if (recipyTime < this.dinnerStart) {
      return 'lunch'
    } else {
      return 'dinner'
    }
  }

}
