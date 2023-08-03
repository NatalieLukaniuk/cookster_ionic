import { RecipyCollection, productPreferencesChip } from './../../../../models/recipies.models';
import { getCurrentUser, getFamilyMembers } from 'src/app/store/selectors/user.selectors';
import { DishType, Recipy } from 'src/app/models/recipies.models';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { MealTime } from 'src/app/models/calendar.models';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { IAppState } from 'src/app/store/reducers';
import { take, map, combineLatest, BehaviorSubject, takeUntil, Subject } from 'rxjs';
import { DataMappingService } from 'src/app/services/data-mapping.service';

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

  recipies$ = combineLatest([
    this.store.pipe(select(getAllRecipies), take(1)),
    this.collectionSelected$,
  ]).pipe(
    map((res) => {
      let [recipies, collection] = res;
      if (collection && collection.name === 'all') {
        return recipies;
      } else if (collection && collection.name !== 'all') {
        return recipies.filter((rec) => collection!.recipies!.includes(rec.id));
      } else return [];
    })
  );

  Math = Math;
  DishType = DishType;

  productChips: productPreferencesChip[] = [];
  constructor(private store: Store<IAppState>, private datamapping: DataMappingService,) {
    this.subscribeForProductChips()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
  }

  @ViewChild(IonModal) modal: IonModal | undefined;

  cancel() {
    this.modal?.dismiss(null, 'cancel');
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

  isPrepSuggestions(recipy: Recipy) {
    return !!recipy.ingrediends.find((ingr) => !!ingr.prep);
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
}
