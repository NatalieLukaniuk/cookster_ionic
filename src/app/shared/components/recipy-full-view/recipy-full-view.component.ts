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
import { ItemOption, ItemOptionActions } from '../ingredient/ingredient.component';
import { Suggestion } from 'src/app/models/calendar.models';
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

  @Input() addPreps: boolean = false;
  @Input() day: Date = new Date();

  @Output() portionsChanged = new EventEmitter<{
    portions: number;
    amountPerPortion: number;
  }>();

  @Output() onAddPrep = new EventEmitter<Suggestion>()

  ingredStartOptions: ItemOption[] = [];

  @ViewChild('header') header: ElementRef | undefined;

  tabs = [
    { value: 'ingredients', icon: '', name: 'Інгридієнти' },
    { value: 'steps', icon: '', name: 'Приготування' },
    { value: 'info', icon: '', name: 'Інформація' },
  ];

  currentTab = this.tabs[0].value;

  selectedStepId = 0;

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.header) {
      let root = document.documentElement;
      root.style.setProperty(
        '--header-height',
        this.header.nativeElement.offsetHeight + 30 + 'px'
      );
    }
    if (changes['addPreps']) {
      if (this.addPreps) {
        this.ingredStartOptions = [
          {
            name: 'Додати заготовку',
            color: 'primary',
            action: ItemOptionActions.AddPrep
          }
        ]
      } else {
        this.ingredStartOptions = []
      }
    }
  }

  onTabChange(event: any) {
    this.currentTab = event.detail.value;
  }

  onPortionsChanged(event: { portions: number; amountPerPortion: number }) {
    this.portionsChanged.emit(event);
  }

  addPrep(prep: Suggestion) {
    this.onAddPrep.emit(prep)
  }
}
