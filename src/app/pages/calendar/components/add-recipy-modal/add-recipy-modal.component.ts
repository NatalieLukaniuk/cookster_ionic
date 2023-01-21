import { SetIsLoadingFalseAction } from './../../../../store/actions/ui.actions';
import { SetIsLoadingAction } from 'src/app/store/actions/ui.actions';
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
import { take } from 'rxjs';

@Component({
  selector: 'app-add-recipy-modal',
  templateUrl: './add-recipy-modal.component.html',
  styleUrls: ['./add-recipy-modal.component.scss'],
})
export class AddRecipyModalComponent {
  @Input() meatime!: MealTime;
  @Output() recipyToAdd = new EventEmitter<string>();

  recipies: Recipy[] = [];

  Math = Math;
  constructor(private store: Store<IAppState>) {}

  @ViewChild(IonModal) modal: IonModal | undefined;

  cancel() {
    this.modal?.dismiss(null, 'cancel');
  }

  ionModalWillPresent() {
    this.store.dispatch(new SetIsLoadingAction());
    this.store.pipe(select(getAllRecipies), take(1)).subscribe((res) => {
      this.recipies = res;
      this.store.dispatch(new SetIsLoadingFalseAction());
    });
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

  isNeedsAdvancePreparation(recipy: Recipy) {
    return recipy.type?.includes(DishType['потребує попередньої підготовки']);
  }

  isPrepSuggestions(recipy: Recipy) {
    return !!recipy.ingrediends.find((ingr) => !!ingr.prep);
  }
}
