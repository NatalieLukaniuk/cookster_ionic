import { Component, effect, inject, OnDestroy, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import * as _ from 'lodash';
import { BehaviorSubject, Subject, debounceTime, map, take, takeUntil, tap } from 'rxjs';
import { FamilyMember, NewFamilyMember } from 'src/app/models/auth.models';
import { Product } from 'src/app/models/recipies.models';
import { DataMappingService } from 'src/app/services/data-mapping.service';
import { ProductsService } from 'src/app/services/products.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { INPUT_DEBOUNCE_TIME } from 'src/app/shared/constants';
import { UpdateFamilyAction } from 'src/app/store/actions/user.actions';
import { IAppState } from 'src/app/store/reducers';

@Component({
  selector: 'app-edit-family',
  templateUrl: './edit-family.component.html',
  styleUrls: ['./edit-family.component.scss']
})
export class EditFamilyComponent implements OnDestroy {
 productsService = inject(ProductsService);
 userDataService = inject(UserDataService);
  newMember = '';

  products: Product[] = [];

  sampleRecommendedPortion = 400;
  portionSizePercentage = '';

  portionSizePercentage$ = new BehaviorSubject<number>(0);

  destroy$ = new Subject<void>();

  calculatedPortionSize$ = this.portionSizePercentage$.pipe(map(portionPercentage => {
    return this.sampleRecommendedPortion * (portionPercentage / 100);
  }))

  $userFamily = this.userDataService.userFamily;


  familyMembers: FamilyMember[] = [];

  activeMember = '';

  $products = this.productsService.getProducts;

  constructor(private store: Store<IAppState>, private datamapping: DataMappingService) {
    this.updatePortionSizePercentage();

    effect(() => {
      const family = this.$userFamily();
      this.familyMembers = family;
      if (!this.activeMember.length) {
        this.activeMember = this.familyMembers[0].id;
        this.portionSizePercentage = this.familyMembers[0].portionSizePercentage ? this.familyMembers[0].portionSizePercentage.toString() : '';
        this.portionSizePercentage$.next(+this.portionSizePercentage)
      }
    })
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }

  @ViewChild(IonModal) newMemberModal: IonModal | undefined;

  dismissAddModal() {
    this.newMemberModal?.dismiss();
  }

  addNewMember() {
    const toAdd = new NewFamilyMember(this.newMember);
    const updatedFamily = this.$userFamily().concat(toAdd);
    this.userDataService.updateFamily(updatedFamily)
    this.dismissAddModal();
    this.newMember = '';
  }

  getProductText(product: Product): string {
    return this.datamapping.getProductNameById(product.id);
  }

  onProductCheck(product: Product, key: keyof FamilyMember, memberId: string) {
    const familyMember = this.familyMembers.find(member => member.id === memberId);
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
    this.store.dispatch(new UpdateFamilyAction(this.familyMembers))
  }

  onTabChange(event: any) {
    this.activeMember = event.detail.value;
    const found = this.familyMembers.find(member => member.id === this.activeMember);
    this.portionSizePercentage = found?.portionSizePercentage ? found.portionSizePercentage.toString() : '';
    this.portionSizePercentage$.next(+this.portionSizePercentage)
  }

  getFilteredProducts(key: keyof FamilyMember, memberId: string) {
    const productsToFilterOut = this.familyMembers.find(member => member.id === memberId)?.[key];
    return this.products.filter(prod => !(productsToFilterOut as string[])?.includes(prod.id))
  }

  onPortionSizePercentageChange(event: string) {
    this.portionSizePercentage$.next(+event);
  }

  updatePortionSizePercentage() {
    this.portionSizePercentage$.pipe(debounceTime(INPUT_DEBOUNCE_TIME), takeUntil(this.destroy$)).subscribe(percentage => {

      const memberToUpdate = this.familyMembers.find(member => member.id === this.activeMember);
      if (memberToUpdate && percentage && memberToUpdate.portionSizePercentage !== +percentage) {
        memberToUpdate.portionSizePercentage = +percentage;
        this.store.dispatch(new UpdateFamilyAction(this.familyMembers))
      }

    })
  }
}
