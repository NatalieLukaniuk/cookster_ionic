import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';
import { User } from 'src/app/models/auth.models';
import { Recipy } from 'src/app/models/recipies.models';
@Component({
  selector: 'app-recipy-full-view',
  templateUrl: './recipy-full-view.component.html',
  styleUrls: ['./recipy-full-view.component.scss'],
})
export class RecipyFullViewComponent implements OnChanges {
  @Input() recipy: Recipy | undefined | null;
  @Input() currentUser!: User | null;

  @Input() portions?: number;
  @Input() amountPerPortion?: number;

  @Output() portionsChanged = new EventEmitter<{
    portions: number;
    amountPerPortion: number;
  }>();

  @ViewChild('header') header: ElementRef | undefined;

  tabs = [
    { value: 'ingredients', icon: '', name: 'Інгридієнти' },
    { value: 'steps', icon: '', name: 'Приготування' },
    { value: 'info', icon: '', name: 'Інформація' },
  ];

  currentTab = this.tabs[0].value;

  selectedStepId = 0;

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (this.header) {
      let root = document.documentElement;
      root.style.setProperty(
        '--header-height',
        this.header.nativeElement.offsetHeight + 30 + 'px'
      );
    }
  }

  onTabChange(event: any) {
    this.currentTab = event.detail.value;
  }

  onPortionsChanged(event: { portions: number; amountPerPortion: number }) {
    this.portionsChanged.emit(event);
  }
}
