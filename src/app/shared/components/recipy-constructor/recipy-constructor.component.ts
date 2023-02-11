import { NewRecipy } from './../../../models/recipies.models';
import {
  UpdateDraftRecipyAction,
  AddNewRecipyAction,
} from './../../../store/actions/recipies.actions';
import { AddDraftRecipyAction } from '../../../store/actions/recipies.actions';
import { Store } from '@ngrx/store';
import {
  DishType,
  DraftRecipy,
  Ingredient,
  PreparationStep,
  Recipy,
} from '../../../models/recipies.models';
import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { User } from 'src/app/models/auth.models';
import {
  Complexity,
  ComplexityDescription,
} from 'src/app/models/recipies.models';
import { getUnitText } from 'src/app/pages/recipies/utils/recipy.utils';

@Component({
  selector: 'app-recipy-constructor',
  templateUrl: './recipy-constructor.component.html',
  styleUrls: ['./recipy-constructor.component.scss'],
})
export class RecipyConstructorComponent implements OnInit {
  @Input() recipyToPatch: DraftRecipy | Recipy | undefined | null;
  @Input() recipyToPatchOrder: number | undefined;
  @Input() currentUser!: User | null;

  tabs = [
    { value: 'info', icon: '', name: 'Інформація' },
    { value: 'ingredients', icon: '', name: 'Інгридієнти' },
    { value: 'steps', icon: '', name: 'Приготування' },
  ];

  get isPublished() {
    if (this.recipyToPatch) {
      return 'id' in this.recipyToPatch;
    } else return false;
  }

  get isSavedDraft() {
    return this.recipyToPatch && this.recipyToPatchOrder;
  }

  recipyName = '';
  isSplitIntoGroups = false;
  complexity = Complexity.simple;
  selectedTags: DishType[] = [];
  recipySource = '';
  isBaseRecipy = false;
  ingredients: Ingredient[] = [];
  steps: PreparationStep[] = [];

  currentTab = this.tabs[0].value;

  constructor(private store: Store) {}

  getUnitText = getUnitText;

  ngOnInit(): void {
    if (this.recipyToPatch) {
      console.log(this.recipyToPatch);
      this.recipyName = this.recipyToPatch.name;
      this.isBaseRecipy = this.recipyToPatch.isBaseRecipy;
      this.complexity = this.recipyToPatch.complexity;
      if (this.recipyToPatch.source) {
        this.recipySource = this.recipyToPatch.source;
      }
      if (this.recipyToPatch.ingrediends?.length) {
        this.ingredients = _.cloneDeep(this.recipyToPatch.ingrediends);
      }
      if (this.recipyToPatch.steps?.length) {
        this.steps = _.cloneDeep(this.recipyToPatch.steps);
      }
      if (this.recipyToPatch.type?.length) {
        this.selectedTags = _.cloneDeep(this.recipyToPatch.type);
      }
    }
  }

  onTabChange(event: any) {
    this.currentTab = event.detail.value;
  }

  get complexityOptions() {
    return [1, 2, 3];
  }
  getComplexityOptionsText(unit: Complexity) {
    return ComplexityDescription[unit];
  }

  get tags() {
    let tags: number[] = [];
    tags = Object.values(DishType).filter(
      (value) => typeof value === 'number'
    ) as number[];
    return tags;
  }

  getTagsText(tag: DishType) {
    return DishType[tag];
  }

  saveDraft() {
    let draftRecipy: DraftRecipy = this.collectDataNewRecipyOrDraft();
    this.store.dispatch(new AddDraftRecipyAction(draftRecipy));
  }

  saveEditedDraft() {
    let draftRecipy: DraftRecipy = this.collectDataNewRecipyOrDraft();
    if (this.recipyToPatchOrder) {
      this.store.dispatch(
        new UpdateDraftRecipyAction(draftRecipy, this.recipyToPatchOrder)
      );
    }
  }

  collectDataNewRecipyOrDraft(): NewRecipy {
    return {
      name: this.recipyName,
      ingrediends: this.ingredients,
      complexity: this.complexity,
      steps: this.steps,
      type: this.selectedTags,
      author: this.currentUser!.email,
      createdOn: Date.now(),
      isSplitIntoGroups: this.isSplitIntoGroups,
      isBaseRecipy: this.isBaseRecipy,
      source: this.recipySource,
    };
  }
  collectDataExistingRecipy(): Recipy | null {
    if (this.recipyToPatch && 'id' in this.recipyToPatch) {
      return {
        id: this.recipyToPatch.id,
        name: this.recipyName,
        ingrediends: this.ingredients,
        complexity: this.complexity,
        steps: this.steps,
        type: this.selectedTags,
        author: this.recipyToPatch.author,
        createdOn: this.recipyToPatch?.createdOn,
        isSplitIntoGroups: this.recipyToPatch.isSplitIntoGroups,
        isBaseRecipy: this.isBaseRecipy,
        source: this.recipySource,
        editedBy: this.currentUser!.email,
        isCheckedAndApproved: this.recipyToPatch.isCheckedAndApproved,
        notApproved: this.recipyToPatch.notApproved,
        photo: this.recipyToPatch.photo,
        lastEdited: Date.now()
      };
    } else return null
  }

  saveNewRecipy() {
    let recipy: NewRecipy = this.collectDataNewRecipyOrDraft();
    this.store.dispatch(new AddNewRecipyAction(recipy));
  }

  updateRecipy() {}

  onSplitChange(event: any) {
    this.isSplitIntoGroups = event.detail.checked;
  }

  onBaseChange(event: any) {
    this.isBaseRecipy = event.detail.checked;
  }

  onTagClicked(event: any, tag: DishType) {
    if (event.detail.checked) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags = this.selectedTags.filter((item) => item !== tag);
    }
  }

  get isReadyToPublish() {
    return !this.notReadyMandatory.length;
  }

  get notReadyMandatory() {
    let list: string[] = [];
    if (this.recipyName.length < 3) {
      list.push('Введіть назву, мінімум 3 символи');
    }
    if (this.selectedTags.length < 1) {
      list.push('Виберіть хоча б один тег');
    }
    if (this.ingredients.length < 1) {
      list.push('Додайте інгридієнти');
    }
    if (this.steps.length < 1) {
      list.push('Додайте опис приготування');
    }
    return list;
  }

  get notReadyOptional() {
    let list: string[] = [];
    if (this.recipySource.length < 3) {
      list.push('Вкажіть джерело рецепту');
    }
    if (this.complexity == Complexity.simple) {
      list.push('Змініть складність');
    }
    if (!this.isSplitIntoGroups) {
      list.push('Розділіть інгридієнти на групи');
    }
    if (!this.isBaseRecipy) {
      list.push('Позначте як базовий рецепт');
    }
    return list;
  }

  onAddIngredient(event: Ingredient) {
    this.ingredients.push(event);
  }

  onDeleteIngr(ingredient: Ingredient) {
    this.ingredients = this.ingredients.filter(
      (item) => item.product !== ingredient.product
    );
  }

  onDeleteStep(step: PreparationStep) {
    this.steps = this.steps.filter(
      (item) => item.description !== step.description
    );
  }

  onAddNewStep(step: PreparationStep) {
    this.steps.push(step);
  }
}
