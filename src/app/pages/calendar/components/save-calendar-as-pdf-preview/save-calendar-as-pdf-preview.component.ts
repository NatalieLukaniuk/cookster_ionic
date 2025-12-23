import { Component, Input, OnInit } from '@angular/core';
import { CalendarComment, RecipyForCalendar_Reworked } from 'src/app/models/calendar.models';
import { getIsNewer, iSameDay } from '../../calendar.utils';
import { SaveAsPdfService } from 'src/app/services/save-as-pdf.service';

interface TreeEl {
  [key: string]: Date | RecipyForCalendar_Reworked[] | CalendarComment[]
}
interface PreviewTreeElement extends TreeEl {
  date: Date,
  breakfast: RecipyForCalendar_Reworked[],
  lunch: RecipyForCalendar_Reworked[],
  dinner: RecipyForCalendar_Reworked[],
  breakfastComments: CalendarComment[],
  lunchComments: CalendarComment[],
  dinnerComments: CalendarComment[]
}

interface PreviewTreeItem {

}

@Component({
  selector: 'app-save-calendar-as-pdf-preview',
  templateUrl: './save-calendar-as-pdf-preview.component.html',
  styleUrls: ['./save-calendar-as-pdf-preview.component.scss'],
})
export class SaveCalendarAsPdfPreviewComponent implements OnInit {
  recipies: RecipyForCalendar_Reworked[] = [];
  comments: CalendarComment[] = [];

  tree: PreviewTreeElement[] = [];

  lunchStart = 11;
  dinnerStart = 16;

  constructor(private saveService: SaveAsPdfService) { }

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
          dinner: [],
          breakfastComments: [],
          lunchComments: [],
          dinnerComments: []
        };
        (newElement[recipyTime] as RecipyForCalendar_Reworked[]).push(recipy);
        this.tree.push(newElement)
      }
    })
    this.comments.forEach(comment => {
      const foundInTree = this.tree.find(el => iSameDay(el.date, new Date(comment.date)))
      const commentTime = this.getCommentTime(comment)
      if (foundInTree) {
        (foundInTree[commentTime] as CalendarComment[]).push(comment)
      } else {
        const newElement: PreviewTreeElement = {
          date: new Date(comment.date),
          breakfast: [],
          lunch: [],
          dinner: [],
          breakfastComments: [],
          lunchComments: [],
          dinnerComments: []
        };
        (newElement[commentTime] as CalendarComment[]).push(comment);
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

  getCommentTime(comment: CalendarComment): string {
    const commentTime = new Date(comment.date).getHours()
    if (commentTime < this.lunchStart) {
      return 'breakfastComments'
    } else if (commentTime < this.dinnerStart) {
      return 'lunchComments'
    } else {
      return 'dinnerComments'
    }
  }

  export() {
    this.saveService.captureScreen('calendar-preview', 'menu')
  }

}
