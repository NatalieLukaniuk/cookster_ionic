import { AddDraftRecipyAction } from '../../../store/actions/recipies.actions';
import { Store } from '@ngrx/store';
import {
  DishType,
  DraftRecipy,
  Ingredient,
  PreparationStep,
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
  @Input() recipyToPatch: DraftRecipy | undefined | null;
  @Input() currentUser!: User | null;

  tabs = [
    { value: 'info', icon: '', name: 'Інформація' },
    { value: 'ingredients', icon: '', name: 'Інгридієнти' },
    { value: 'steps', icon: '', name: 'Приготування' },
  ];

  recipyName = '';
  isSplitIntoGroups = false;
  complexity = Complexity.simple;
  selectedTags: DishType[] = [];
  recipySource = '';
  isBaseRecipy = false;
  ingredients: Ingredient[] = [];
  steps: PreparationStep[] = [];

  currentTab = this.tabs[2].value;

  constructor(private store: Store) {}

  getUnitText = getUnitText;

  ngOnInit(): void {
    if (this.recipyToPatch) {
      this.recipyName = this.recipyToPatch.name;
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
    console.log(this.selectedTags);
    let draftRecipy: DraftRecipy = {
      name: this.recipyName,
      ingrediends: this.ingredients,
      complexity: this.complexity,
      steps: this.steps,
      type: this.selectedTags,
      author: this.currentUser!.email,
      createdOn: Date.now(),
      isSplitIntoGroups: [],
      isBaseRecipy: this.isBaseRecipy,
      source: this.recipySource,
    };
    this.store.dispatch(new AddDraftRecipyAction(draftRecipy));
  }

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
