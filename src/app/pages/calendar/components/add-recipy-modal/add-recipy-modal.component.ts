import { RecipyCollection } from './../../../../models/recipies.models';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { DishType, Recipy } from 'src/app/models/recipies.models';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { MealTime } from 'src/app/models/calendar.models';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { IAppState } from 'src/app/store/reducers';
import { take, map, combineLatest, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-add-recipy-modal',
  templateUrl: './add-recipy-modal.component.html',
  styleUrls: ['./add-recipy-modal.component.scss'],
})
export class AddRecipyModalComponent {
  @Input() meatime!: MealTime;
  @Input() date!: string;
  @Output() recipyToAdd = new EventEmitter<string>();

  collections$ = this.store.pipe(
    select(getCurrentUser),
    map((user) => user?.collections)
  );

  collectionSelected$ = new BehaviorSubject<
    RecipyCollection | null | { name: 'all'; recipies: any[] }
  >(null);

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
  constructor(private store: Store<IAppState>) {}

  @ViewChild(IonModal) modal: IonModal | undefined;

  cancel() {
    this.modal?.dismiss(null, 'cancel');
  }

  onRecipyClicked(recipyid: string) {
    this.modal?.dismiss(recipyid, 'confirm');
    this.recipyToAdd.emit(recipyid);
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
}
