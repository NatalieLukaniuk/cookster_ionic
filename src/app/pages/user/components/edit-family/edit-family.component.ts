import { Component, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import * as _ from 'lodash';
import { take } from 'rxjs';
import { FamilyMember, NewFamilyMember } from 'src/app/models/auth.models';
import { UpdateFamilyAction } from 'src/app/store/actions/user.actions';
import { IAppState } from 'src/app/store/reducers';
import { getFamilyMembers } from 'src/app/store/selectors/user.selectors';

@Component({
  selector: 'app-edit-family',
  templateUrl: './edit-family.component.html',
  styleUrls: ['./edit-family.component.scss']
})
export class EditFamilyComponent {
  newMember = '';

  familyMembers$ = this.store.pipe(select(getFamilyMembers));

  constructor(private store: Store<IAppState>) {

  }

  @ViewChild(IonModal) newMemberModal: IonModal | undefined;

  dismissAddModal() {
    this.newMemberModal?.dismiss();
  }

  addNewMember() {
    const toAdd = new NewFamilyMember(this.newMember);
    this.familyMembers$.pipe(take(1)).subscribe(family => {
      let updated: FamilyMember[] = [];
      if (family?.length) {
        updated = _.cloneDeep(family);
      }
      updated.push(toAdd);
      this.store.dispatch(new UpdateFamilyAction(updated));
    })

    this.dismissAddModal();
    this.newMember = '';
  }
}
