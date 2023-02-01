import { AddPrepModalComponent } from './../add-prep-modal/add-prep-modal.component';
import { DataMappingService } from 'src/app/services/data-mapping.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subject, Observable, tap, combineLatest, takeUntil, map } from 'rxjs';
import { User } from 'src/app/models/auth.models';
import {
  Suggestion,
  Day,
  RecipyForCalendar,
} from 'src/app/models/calendar.models';
import { PlannerByDate } from 'src/app/models/planner.models';
import {
  Product,
  Ingredient,
  MeasuringUnit,
  MeasuringUnitText,
} from 'src/app/models/recipies.models';
import { convertAmountToSelectedUnit } from 'src/app/pages/recipies/utils/recipy.utils';
import { IAppState } from 'src/app/store/reducers';
import { getCalendar } from 'src/app/store/selectors/calendar.selectors';
import { getCurrentPlanner } from 'src/app/store/selectors/planners.selectors';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { ModalController } from '@ionic/angular';
import * as _ from 'lodash';
import * as UserActions from '../../../../store/actions/user.actions';
import { DialogsService } from 'src/app/services/dialogs.service';

@Component({
  selector: 'app-preps',
  templateUrl: './preps.component.html',
  styleUrls: ['./preps.component.scss'],
})
export class PrepsComponent implements OnInit, OnDestroy {
  currentPlanner: PlannerByDate | undefined;
  destroyed$ = new Subject<void>();
  allPrepsInDateRange: Suggestion[] = [];

  planner$: Observable<PlannerByDate | null>;
  calendar$: Observable<Day[] | null>;
  allProducts$: Observable<Product[]>;

  allProducts!: Product[] | null;
  currentUser: User | undefined;
  currentUser$ = this.store.pipe(
    select(getCurrentUser),
    tap((user) => {
      if (user) {
        this.currentUser = user;
      }
    })
  );

  constructor(
    private store: Store<IAppState>,
    private recipiesService: DataMappingService,
    private modalCtrl: ModalController,
    private dialog: DialogsService
  ) {
    this.planner$ = this.store.pipe(select(getCurrentPlanner));
    this.calendar$ = this.store.pipe(select(getCalendar));
    this.allProducts$ = this.recipiesService.products$.asObservable();
  }
  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  ngOnInit() {
    combineLatest([this.planner$, this.calendar$, this.allProducts$])
      .pipe(
        takeUntil(this.destroyed$),
        map((res) => ({ planner: res[0], calendar: res[1], products: res[2] }))
      )
      .subscribe((res) => {
        if (res.planner) {
          this.currentPlanner = res.planner;
        }
        if (res.products) {
          this.allProducts = res.products;
        }
        if (res.calendar && res.planner && res.products) {
          this.findPrep(res.calendar, {
            startDate: res.planner.startDate,
            endDate: res.planner.endDate,
          });
        }
      });
  }

  findPrep(calendar: Day[], dateRange: { startDate: string; endDate: string }) {
    this.allPrepsInDateRange = [];
    calendar.forEach((day: Day) => {
      if (day.details.breakfastRecipies.length) {
        day.details.breakfastRecipies.forEach((recipy: RecipyForCalendar) => {
          recipy.ingrediends.forEach((ingr) => {
            if (ingr.prep) {
              ingr.prep.forEach((text) => {
                this.addSuggestion(
                  ingr,
                  this.recipiesService.getCoeficient(
                    recipy.ingrediends,
                    recipy.portions,
                    recipy.amountPerPortion
                  ),
                  text,
                  recipy.id,
                  recipy.name,
                  day.value.toDate()
                );
              });
            }
          });
        });
      }
      if (day.details.lunchRecipies.length) {
        day.details.lunchRecipies.forEach((recipy: RecipyForCalendar) => {
          recipy.ingrediends.forEach((ingr) => {
            if (ingr.prep) {
              ingr.prep.forEach((text) => {
                this.addSuggestion(
                  ingr,
                  this.recipiesService.getCoeficient(
                    recipy.ingrediends,
                    recipy.portions,
                    recipy.amountPerPortion
                  ),
                  text,
                  recipy.id,
                  recipy.name,
                  day.value.toDate()
                );
              });
            }
          });
        });
      }
      if (day.details.dinnerRecipies.length) {
        day.details.dinnerRecipies.forEach((recipy: RecipyForCalendar) => {
          recipy.ingrediends.forEach((ingr) => {
            if (ingr.prep) {
              ingr.prep.forEach((text) => {
                this.addSuggestion(
                  ingr,
                  this.recipiesService.getCoeficient(
                    recipy.ingrediends,
                    recipy.portions,
                    recipy.amountPerPortion
                  ),
                  text,
                  recipy.id,
                  recipy.name,
                  day.value.toDate()
                );
              });
            }
          });
        });
      }
    });
  }

  addSuggestion(
    ingredient: Ingredient,
    coef: number,
    prepDescription: string,
    recipyId: string,
    recipyName: string,
    day: Date
  ) {
    if (this.allProducts) {
      let suggestion: Suggestion = {
        ingredients: [
          {
            productId: ingredient.product,
            productName: this.recipiesService.getIngredientText(ingredient),
            amount: convertAmountToSelectedUnit(
              ingredient.amount * coef,
              ingredient.defaultUnit,
              ingredient.product,
              this.allProducts
            ),
            unit: ingredient.defaultUnit,
          },
        ],

        prepDescription: prepDescription,
        recipyId: recipyId,
        recipyTitle: recipyName,
        day: day,
      };
      this.allPrepsInDateRange.push(suggestion);
    }
  }

  isSaved(suggestion: Suggestion): boolean {
    if (this.currentUser && !!this.currentUser.savedPreps) {
      return !!this.currentUser.savedPreps.find((savedS: Suggestion) => {
        return (
          savedS.prepDescription === suggestion.prepDescription &&
          savedS.recipyId === suggestion.recipyId
        );
      });
    } else return false;
  }

  dateSaved(suggestion: Suggestion): Date | null{
    if (this.currentUser && !!this.currentUser.savedPreps) {
      let found = this.currentUser.savedPreps.find((savedS: Suggestion) => {
        return (
          savedS.prepDescription === suggestion.prepDescription &&
          savedS.recipyId === suggestion.recipyId
        );
      });
      if(found){
        return found.day
      } else return null;
    } else return null;
  }

  removeFromList(suggestion: Suggestion) {
    this.dialog
      .openConfirmationDialog(
        `Видалити ${suggestion.prepDescription}?`,
        'Ця дія незворотня'
      )
      .then((res) => {
        if (res.role === 'confirm') {
          if (this.currentUser && this.currentUser.savedPreps) {
            let updatedUser = _.cloneDeep(this.currentUser);
            updatedUser.savedPreps = updatedUser.savedPreps!.filter((prep) => {
              return !(
                prep.prepDescription === suggestion.prepDescription &&
                prep.recipyId === suggestion.recipyId
              );
            });
            this.store.dispatch(new UserActions.UpdateUserAction(updatedUser));
          }
        }
      });
  }

  async addToList(prep: Suggestion) {
    const modal = await this.modalCtrl.create({
      component: AddPrepModalComponent,
      componentProps: {
        prep: prep,
      },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && this.currentPlanner) {
      if (this.currentUser && this.currentUser.savedPreps) {
        let updatedUser = _.cloneDeep(this.currentUser);
        updatedUser.savedPreps!.push(data);
        this.store.dispatch(new UserActions.UpdateUserAction(updatedUser));
      } else if (this.currentUser) {
        let updatedUser = _.cloneDeep(this.currentUser);
        updatedUser.savedPreps = [];
        updatedUser.savedPreps.push(data);
        this.store.dispatch(new UserActions.UpdateUserAction(updatedUser));
      }
    }
  }

  getUnitText(unit: MeasuringUnit) {
    return MeasuringUnitText[unit];
  }
}
