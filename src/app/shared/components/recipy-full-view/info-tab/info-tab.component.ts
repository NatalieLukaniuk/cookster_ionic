import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Role, User } from 'src/app/models/auth.models';
import {
  ComplexityDescription,
  DishType,
  Recipy,
} from 'src/app/models/recipies.models';
import { UpdateRecipyAction } from 'src/app/store/actions/recipies.actions';
import { IAppState } from 'src/app/store/reducers';

@Component({
  selector: 'app-info-tab',
  templateUrl: './info-tab.component.html',
  styleUrls: ['./info-tab.component.scss'],
})
export class InfoTabComponent implements OnInit {
  @Input() recipy!: Recipy;
  @Input() currentUser!: User | null;

  get tags() {
    let tags: string[] = [];
    if (this.recipy) {
      this.recipy.type?.forEach((tag: DishType) => {
        tags.push(DishType[tag]);
      });
    }
    return tags;
  }

  get complexity() {
    if (this.recipy) {
      return ComplexityDescription[this.recipy.complexity];
    } else return '';
  }

  get activeTime() {
    let time = 0;
    if (this.recipy) {
      for (let step of this.recipy.steps) {
        time = time + +step.timeActive;
      }
    }
    return time;
  }

  get passiveTime() {
    let time = 0;
    if (this.recipy) {
      for (let step of this.recipy.steps) {
        time = time + +step.timePassive;
      }
    }
    return time;
  }

  get isUserAdmin(): boolean {
    return !!(this.currentUser && this.currentUser.role == Role.Admin);
  }

  constructor(private store: Store<IAppState>) {}

  ngOnInit() {}

  onisCheckedAndApprovedClicked(event: any) {
    if (this.recipy) {
      let updatedRecipy: Recipy = {
        ...this.recipy,
        isCheckedAndApproved: event.detail.checked,
      } as Recipy;
      this.store.dispatch(new UpdateRecipyAction(updatedRecipy));
    }
  }
}
