import { RecipyCollection, productPreferencesChip } from './../../../../models/recipies.models';
import { getCurrentUser, getFamilyMembers, getUserPlannedRecipies } from 'src/app/store/selectors/user.selectors';
import { DishType, Recipy } from 'src/app/models/recipies.models';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { IDayDetails, MealTime } from 'src/app/models/calendar.models';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { InfiniteScrollCustomEvent, IonModal } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { IAppState } from 'src/app/store/reducers';
import { take, map, combineLatest, BehaviorSubject, takeUntil, Subject, tap } from 'rxjs';
import { DataMappingService } from 'src/app/services/data-mapping.service';
import { FiltersService } from 'src/app/filters/services/filters.service';
import * as _ from 'lodash';
import { CalendarService } from 'src/app/services/calendar.service';
import * as moment from 'moment';

@Component({
  selector: 'app-add-recipy-modal',
  templateUrl: './add-recipy-modal.component.html',
  styleUrls: ['./add-recipy-modal.component.scss'],
})
export class AddRecipyModalComponent implements OnDestroy {
  @Input() meatime!: MealTime;
  @Input() date!: string;
  @Output() recipyToAdd = new EventEmitter<Recipy>();

  collections$ = this.store.pipe(
    select(getCurrentUser),
    map((user) => user?.collections)
  );

  collectionSelected$ = new BehaviorSubject<
    RecipyCollection | null | { name: 'all'; recipies: any[] }
  >(null);

  destroy$ = new Subject<void>();

  filters$ = this.filtersService.getFilters;

  recipies: Recipy[] = [];

  numberOfRecipiesToDisplay = 10;

  recipies$ = combineLatest([
    this.store.pipe(select(getAllRecipies), take(1)),
    this.collectionSelected$,
    this.filters$,
    this.store.pipe(select(getUserPlannedRecipies))
  ]).pipe(
    map((res) => {
      let [recipies, collection, filters, plannedRecipies] = res;
      const clonedRecipies = _.cloneDeep(recipies);
      if (collection && collection.name === 'all') {

        const filtered = this.filtersService.applyFilters(clonedRecipies, filters);
        const mapped = filtered.map(recipy => this.addLastPrepared(recipy, plannedRecipies));
        const sorted = this.getSortedByLastPrepared(mapped);
        return sorted
      } else if (collection && collection.name !== 'all') {
        const recipiesInCollection = clonedRecipies.filter((rec) => collection!.recipies!.includes(rec.id));
        const filtered = this.filtersService.applyFilters(recipiesInCollection, filters);
        const mapped = filtered.map(recipy => this.addLastPrepared(recipy, plannedRecipies));
        const sorted = this.getSortedByLastPrepared(mapped);
        return sorted
      } else return [];
    }),
    tap(recipies => this.recipies = recipies)
  );

  getSortedByLastPrepared(recipies: Recipy[]) {
    const cloned = _.cloneDeep(recipies);
    cloned.sort((a, b) => this.sortByLastPrepared(a, b));
    return cloned
  }

  sortByLastPrepared(a: Recipy, b: Recipy) {
    if (!a.lastPrepared) {
      return -1
    }
    if (!b.lastPrepared) {
      return 1
    }
    if (moment(a.lastPrepared, 'DDMMYYYY').clone().isAfter(moment(b.lastPrepared, 'DDMMYYYY').clone())) {
      return 1
    } else {
      return -1
    }
  }

  addLastPrepared(recipy: Recipy, allPlannedRecipies: IDayDetails[] | undefined) {
    let updated = {
      ...recipy,
      lastPrepared: allPlannedRecipies ? this.calendarService.getLastPreparedDate(recipy.id, allPlannedRecipies) : 'N/A'
    }
    return updated
  }

  Math = Math;
  DishType = DishType;

  showGoTop = false;

  productChips: productPreferencesChip[] = [];
  constructor(
    private store: Store<IAppState>,
    private datamapping: DataMappingService,
    private filtersService: FiltersService,
    private calendarService: CalendarService
  ) {
    this.subscribeForProductChips()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
  }

  @ViewChild(IonModal) modal: IonModal | undefined;

  cancel() {
    this.modal?.dismiss(null, 'cancel');
  }

  open() {
    this.modal?.present()
  }

  onRecipyClicked(recipy: Recipy) {
    this.modal?.dismiss(recipy, 'confirm');
    this.recipyToAdd.emit(recipy);
  }

  preparationTime(recipy: Recipy) {
    let time = 0;
    for (let step of recipy.steps) {
      time = time + +step.timeActive + +step.timePassive;
    }
    return time;
  }

  activePreparationTime(recipy: Recipy) {
    let time = 0;
    for (let step of recipy.steps) {
      time = time + +step.timeActive;
    }
    return time;
  }

  passivePreparationTime(recipy: Recipy) {
    let time = 0;
    for (let step of recipy.steps) {
      time = time + +step.timePassive;
    }
    return time;
  }

  isNeedsAdvancePreparation(recipy: Recipy) {
    return recipy.type?.includes(DishType['потребує попередньої підготовки']);
  }


  get mealtimeText() {
    switch (this.meatime) {
      case MealTime.Breakfast:
        return 'Сніданок';
      case MealTime.Lunch:
        return 'Обід';
      case MealTime.Dinner:
        return 'Вечеря';
    }
  }

  subscribeForProductChips() {
    this.store.pipe(select(getFamilyMembers), takeUntil(this.destroy$), map(familyMembers => {
      if (familyMembers && familyMembers.length) {
        let likeChips = familyMembers.map(member => {
          if (member.like) {
            return member.like.map(item => ({ name: member.name, productId: item, color: 'success' }))
          } else return []
        }
        ).flat().filter(i => !!i.productId);

        let noLikeChips = familyMembers.map(member => {
          if (member.noLike) {
            return member.noLike.map(item => ({ name: member.name, productId: item, color: 'warning' }))
          } else return []
        }
        ).flat().filter(i => !!i.productId);

        let noEatChips = familyMembers.map(member => {
          if (member.noEat) {
            return member.noEat.map(item => ({ name: member.name, productId: item, color: 'danger' }))
          } else return []
        }
        ).flat().filter(i => !!i.productId);

        const concatenated = likeChips.concat(noLikeChips).concat(noEatChips);
        this.productChips = concatenated
      }
    })).subscribe()
  }

  getIsInRecipy(productId: string, recipy: Recipy) {
    return !!recipy.ingrediends.find(ingred => ingred.product === productId);
  }

  getProductText(id: string) {
    return this.datamapping.getProductNameById(id)
  }

  onIonInfinite(event: any) {
    this.numberOfRecipiesToDisplay += 10;
    (event as InfiniteScrollCustomEvent).target.complete();
  }

  onscroll(event: any) {
    this.showGoTop = event.detail.scrollTop > 500;
  }

  @ViewChild('scrollingContainer') scrollingContainer: any;

  goTop() {
    this.scrollingContainer.scrollToTop()
  }

  getDateText() {
    return moment(this.date, 'DD-MM-YYYY').format('dddd, MMM D')
  }
}
