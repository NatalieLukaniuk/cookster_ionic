import { defaultPrefs } from './../../../models/auth.models';
import { Recipy } from 'src/app/models/recipies.models';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'src/app/models/auth.models';
import * as _ from 'lodash';
import { UpdatePreferencesAction } from 'src/app/store/actions/user.actions';
import { IAppState } from 'src/app/store/reducers';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-add-recipy-to-no-show',
  templateUrl: './add-recipy-to-no-show.component.html',
  styleUrls: ['./add-recipy-to-no-show.component.scss'],
})
export class AddRecipyToNoShowComponent {
  @Input() buttonColor = 'primary';
  @Input() recipy: Recipy | undefined;
  @Input() currentUser: User | null = null;
  @Input() isSmall = true;

  @Output() btnClicked = new EventEmitter<void>()

  constructor(private store: Store<IAppState>){}

  addToNoShow(){
    if(this.recipy && this.currentUser){
      let cloned_preferences = _.cloneDeep(this.currentUser).preferences;
      if(!cloned_preferences){
        cloned_preferences = {
          ...defaultPrefs,
          noShowRecipies: [this.recipy.id]
        }
      } else if(cloned_preferences.noShowRecipies){
        cloned_preferences.noShowRecipies.push(this.recipy.id)
      } else {
        cloned_preferences.noShowRecipies = [this.recipy.id]
      }

      this.store.dispatch(new UpdatePreferencesAction(cloned_preferences))
    }
    this.btnClicked.emit()
  }
 }
