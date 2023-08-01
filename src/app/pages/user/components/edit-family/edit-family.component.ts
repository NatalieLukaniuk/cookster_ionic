import { Component, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable, map, take, tap } from 'rxjs';
import { FamilyMember, NewFamilyMember } from 'src/app/models/auth.models';
import { Product } from 'src/app/models/recipies.models';
import { DataMappingService } from 'src/app/services/data-mapping.service';
import { UpdateFamilyAction } from 'src/app/store/actions/user.actions';
import { IAppState } from 'src/app/store/reducers';
import { getAllProducts } from 'src/app/store/selectors/recipies.selectors';
import { getFamilyMembers } from 'src/app/store/selectors/user.selectors';

@Component({
  selector: 'app-edit-family',
  templateUrl: './edit-family.component.html',
  styleUrls: ['./edit-family.component.scss']
})
export class EditFamilyComponent {
  newMember = '';

  products: Product[] = [];

  familyMembers$ = this.store.pipe(select(getFamilyMembers), tap(res => {
    if (res) {
      this.familyMembers = res;
      if (!this.activeMember.length) {
        this.activeMember = this.familyMembers[0].id;
      }
    }
  }));

  familyMembers: FamilyMember[] = [];

  activeMember = '';

  products$: Observable<Product[]> = this.store.pipe(
    select(getAllProducts),
    map((res) => {
      if (res) {
        let products = res.map((i) => i);
        products.sort((a, b) => a.name.localeCompare(b.name));
        this.products = products;
        return products;
      } else return [];
    })
  );

  constructor(private store: Store<IAppState>, private datamapping: DataMappingService) {

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

  getProductText(product: Product): string {
    return this.datamapping.getProductNameById(product.id);
  }

  onProductCheck(product: Product, key: keyof FamilyMember, memberId: string) {
    const cloned = _.cloneDeep(this.familyMembers);
    const familyMember = cloned.find(member => member.id === memberId);
    if (familyMember) {
      let arrayToUpdate = familyMember[key] as string[];
      if (arrayToUpdate && arrayToUpdate.includes(product.id)) {
        (familyMember[key] as string[]) = arrayToUpdate.filter(prod => prod !== product.id);
      } else if (arrayToUpdate) {
        arrayToUpdate.push(product.id);
      } else {
        (familyMember[key] as string[]) = [product.id];
      }
    }
    this.store.dispatch(new UpdateFamilyAction(cloned))
  }

  onTabChange(event: any) {
    this.activeMember = event.detail.value;
  }

  getFilteredProducts(key: keyof FamilyMember, memberId: string) {
    const productsToFilterOut = this.familyMembers.find(member => member.id === memberId)?.[key];
    return this.products.filter(prod => !productsToFilterOut?.includes(prod.id))
  }
}
