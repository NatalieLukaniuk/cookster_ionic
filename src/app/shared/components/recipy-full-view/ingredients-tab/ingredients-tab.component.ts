import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { Recipy } from 'src/app/models/recipies.models';
import { DataMappingService } from 'src/app/services/data-mapping.service';
import { ItemOption } from '../../ingredient/ingredient.component';
import { ModalController } from '@ionic/angular';
import { IAppState } from 'src/app/store/reducers';
import { Store, select } from '@ngrx/store';
import { getFamilyMembers, getUserPreferences } from 'src/app/store/selectors/user.selectors';
import { Subject, takeUntil } from 'rxjs';
import { AVERAGE_PORTION } from 'src/app/shared/constants';

@Component({
  selector: 'app-ingredients-tab',
  templateUrl: './ingredients-tab.component.html',
  styleUrls: ['./ingredients-tab.component.scss'],
})
export class IngredientsTabComponent implements OnInit, OnChanges, OnDestroy {
  @Input() recipy!: Recipy;

  @Input() portions?: number;
  @Input() amountPerPortion?: number;
  @Input() ingredStartOptions: ItemOption[] = [];


  @Output() portionsChanged = new EventEmitter<{
    portions: number;
    amountPerPortion: number;
  }>();

  isEditPortions = false;

  isSplitToGroups: boolean = false;
  groups: string[] = [];

  portionsToServe: number = 4;
  portionSize: number =  AVERAGE_PORTION;

  coeficient: number = 1;

  destroy$ = new Subject<void>();

  constructor(private datamapping: DataMappingService, private store: Store<IAppState>) {

  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }

  ngOnInit() {   
    if (!this.portions && !this.amountPerPortion) {
      this.store.pipe(select(getUserPreferences), takeUntil(this.destroy$)).subscribe(preferences => {
        if (preferences && !preferences.isUsePersonalizedPortionSize && (!preferences.isUseRecommendedPortionSize || !this.recipy.portionSize)) {
          this.portionSize = preferences.defaultPortionSize;
          this.getCoeficient()
        } else if (preferences && preferences.isUseRecommendedPortionSize && this.recipy.portionSize) {
          this.portionSize = this.recipy.portionSize;
          this.getCoeficient()
        } else {
          this.portionSize = this.recipy?.portionSize ? this.recipy.portionSize : AVERAGE_PORTION;
          this.getCoeficient()
        }
      })
      this.store.pipe(select(getFamilyMembers), takeUntil(this.destroy$)).subscribe(members => {
        if (members && members.length) {
          this.portionsToServe = members.length
          this.getCoeficient()
        }
      })
    }

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['portions'] && changes['portions'].currentValue !== changes['portions'].previousValue) {
      this.portionsToServe = changes['portions'].currentValue;
    }

    if (changes['amountPerPortion'] && changes['amountPerPortion'].currentValue !== changes['amountPerPortion'].previousValue) {
      this.portionSize = changes['amountPerPortion'].currentValue;
    }

    this.getCoeficient();
    this.isSplitToGroups = this.recipy.isSplitIntoGroups;
    if (this.recipy.isSplitIntoGroups) {
      this.getIngredientsByGroup();
    } else {
      this.groups = []
    }

  }

  getIngredientsByGroup() {
    this.groups = [];
    if (!!this.recipy && this.recipy.isSplitIntoGroups) {
      this.groups = this.getGroups();
    }
  }

  getGroups(): string[] {
    let group: string[] = [];
    for (let ingr of this.recipy.ingrediends) {
      if (ingr.group && !group.includes(ingr.group)) {
        group.push(ingr.group);
      }
    }
    return group;
  }

  getCoeficient() {
    if (this.recipy && this.portionsToServe) {
      this.coeficient = this.datamapping.getCoeficient(
        this.recipy.ingrediends,
        this.portionsToServe,
        this.portionSize
      );
    }
  }

  onPortionsChanged() {
    this.portionsChanged.emit({
      portions: +this.portionsToServe,
      amountPerPortion: +this.portionSize,
    });

    this.isEditPortions = false;
  }
}
