import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DataMappingService } from '../../../services/data-mapping.service';
import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/auth.models';
import {
  ComplexityDescription,
  DishType,
  Ingredient,
  Recipy,
  productPreferencesChip,
} from 'src/app/models/recipies.models';
import * as _ from 'lodash';
import { IAppState } from 'src/app/store/reducers';
import { UpdateUserAction } from 'src/app/store/actions/user.actions';

@Component({
  selector: 'app-recipy-short-view',
  templateUrl: './recipy-short-view.component.html',
  styleUrls: ['./recipy-short-view.component.scss'],
})
export class RecipyShortViewComponent implements OnInit {
  @Input()
  recipy!: Recipy;
  @Input()
  currentUser!: User | null;
  @Input() productPreferencesChips: productPreferencesChip[] | null = []

  isNeedsAdvancePreparation: boolean = false;
  isPrepSuggestions: boolean = false;

  isRecipyClicked: boolean = false;
  isShowCollections: boolean = false;

  ingredientsToSkip = [
    '-Mu5TNCG6N8Q_nwkPmNb',
    '-Mu5UmO24kMVyKveKjah',
    '-MuzaMFzts_yzcBtPRyt',
    '-Muzb3OfJhqdsrleyz2a',
  ];

  Math = Math;
  DishType = DishType;

  get preparationTime() {
    let time = 0;
    for (let step of this.recipy.steps) {
      time = time + +step.timeActive + +step.timePassive;
    }
    return time;
  }

  get topIngredients() {
    let sorted = this.recipy.ingrediends
      .map((ingr) => ingr)
      .sort((a, b) => b.amount - a.amount);
    sorted = sorted.filter(
      (ingr) => !this.ingredientsToSkip.includes(ingr.product)
    );
    if (sorted.length >= 6) {
      sorted.splice(5);
    }
    return sorted;
  }

  getIngredientText(ingredient: Ingredient): string {
    return this.datamapping.getIngredientText(ingredient);
  }

  get complexity() {
    return ComplexityDescription[this.recipy.complexity];
  }

  get includedInCollections(): string[] {
    if (this.currentUser?.collections) {
      return this.currentUser.collections
        .filter((collection) => collection.recipies?.includes(this.recipy.id))
        .map((coll) => coll.name);
    } else return [];
  }

  get recipyCollections() {
    if (this.currentUser?.collections) {
      return this.currentUser.collections.map((collection) => collection.name);
    } else return [];
  }

  constructor(
    private datamapping: DataMappingService,
    private store: Store<IAppState>,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.isNeedsAdvancePreparation = this.recipy.type?.includes(
      DishType['потребує попередньої підготовки']
    );
    this.isPrepSuggestions = !!this.recipy.ingrediends.find(
      (ingr) => !!ingr.prep
    );
  }

  onRecipyClicked() {
    if (this.isShowCollections && this.isRecipyClicked) {
      this.isShowCollections = true;
      this.isRecipyClicked = false;
    } else if (this.isShowCollections && !this.isRecipyClicked) {
      this.isShowCollections = false;
    } else {
      this.isRecipyClicked = !this.isRecipyClicked;
    }
  }

  showCollections() {
    this.isShowCollections = true;
  }

  onCollectionSelected(collection: string) {
    if (this.currentUser) {
      let updated = _.cloneDeep(this.currentUser);
      updated.collections = updated.collections!.map((coll) => {
        if (coll.name === collection) {
          if (coll.recipies && coll.recipies.includes(this.recipy.id)) {
            coll.recipies = coll.recipies.filter((id) => id !== this.recipy.id);
          } else if (coll.recipies && !coll.recipies.includes(this.recipy.id)) {
            coll.recipies.push(this.recipy.id);
          } else {
            coll.recipies = [this.recipy.id];
          }
          return coll;
        } else return coll;
      });
      this.store.dispatch(
        new UpdateUserAction(
          updated,
          `${this.recipy.id} додано до колекції ${collection}`
        )
      );
    }
  }

  getIsInCollection(collection: string) {
    if (this.currentUser?.collections) {
      return this.currentUser.collections
        .find((coll) => coll.name == collection)
        ?.recipies?.find((recipy) => recipy == this.recipy.id);
    } else return false;
  }

  goFullRecipy() {
    this.router.navigate(['recipy/', this.recipy.id], {
      relativeTo: this.route,
    });
  }

  activePreparationTime() {
    let time = 0;
    for (let step of this.recipy.steps) {
      time = time + +step.timeActive;
    }
    return time;
  }

  passivePreparationTime() {
    let time = 0;
    for (let step of this.recipy.steps) {
      time = time + +step.timePassive;
    }
    return time;
  }

  getProductText(id: string) {
    return this.datamapping.getProductNameById(id)
  }

  getIsInRecipy(productId: string) {
    return !!this.recipy.ingrediends.find(ingred => ingred.product === productId);
  }
}
