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
import { Ingredient, Recipy } from 'src/app/models/recipies.models';
import { DataMappingService } from 'src/app/services/data-mapping.service';
import { ItemOption, ItemOptionActions } from '../../ingredient/ingredient.component';
import { Suggestion } from 'src/app/models/calendar.models';
import { ModalController } from '@ionic/angular';
import { ControllerInputDialogComponent } from '../../dialogs/controller-input-dialog/controller-input-dialog.component';
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
  @Input() day: Date = new Date();

  @Output() portionsChanged = new EventEmitter<{
    portions: number;
    amountPerPortion: number;
  }>();

  @Output() addPrep = new EventEmitter<Suggestion>()

  isEditPortions = false;

  isSplitToGroups: boolean = false;
  groups: string[] = [];

  portionsToServe: number = 4;
  portionSize: number = AVERAGE_PORTION;

  coeficient: number = 1;

  destroy$ = new Subject<void>();

  constructor(private datamapping: DataMappingService, private modalCtrl: ModalController, private store: Store<IAppState>, private cdr: ChangeDetectorRef) {

  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }

  ngOnInit() {
    if (this.portions) {
      this.portionsToServe = this.portions;
    }

    if (this.amountPerPortion) {
      this.portionSize = this.amountPerPortion;
    }

    if (!this.portions && !this.amountPerPortion) {
      this.store.pipe(select(getUserPreferences), takeUntil(this.destroy$)).subscribe(preferences => {
        if (preferences && !preferences.isUsePersonalizedPortionSize && (!preferences.isUseRecommendedPortionSize || !this.recipy.portionSize)) {
          this.portionSize = preferences.defaultPortionSize;
          this.getCoeficient()
        } else if (preferences && preferences.isUseRecommendedPortionSize && this.recipy.portionSize) {
          this.portionSize = this.recipy.portionSize;
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


    this.getCoeficient();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.recipy.isSplitIntoGroups) {
      this.isSplitToGroups = true;
      this.getIngredientsByGroup();
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
      portions: this.portionsToServe,
      amountPerPortion: this.portionSize,
    });

    this.isEditPortions = false;
  }

  async onEventEmitted(action: ItemOptionActions, ingredient: Ingredient) {
    const modal = await this.modalCtrl.create({
      component: ControllerInputDialogComponent,
      componentProps: {
        inputFieldLabel: 'Enter description',
      },
      breakpoints: [0.5, 0.75],
      initialBreakpoint: 0.5
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();


    if (role === 'confirm') {
      const prep: Suggestion = {
        ingredients: [
          {
            productId: ingredient.product,
            productName: ingredient.ingredient!,
            amount: ingredient.amount * this.coeficient,
            unit: ingredient.defaultUnit
          }
        ],
        prepDescription: data,
        recipyId: this.recipy.id,
        recipyTitle: this.recipy.name,
        day: this.day // TODO: this doesn't need to be passed down from parent components, user should be able to select it
      }
      this.addPrep.emit(prep);
    }
  }
}
