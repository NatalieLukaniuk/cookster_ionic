import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { FamilyMember, User } from 'src/app/models/auth.models';
import { DataMappingService } from 'src/app/services/data-mapping.service';
import { IAppState } from 'src/app/store/reducers';
import { getCurrentUser, getFamilyMembers } from 'src/app/store/selectors/user.selectors';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  settingOptions = [
    {
      title: 'Налаштування сім\'ї',
      link: 'family-settings'
    },
    {
      title: 'Загальні налаштування',
      link: 'settings'
    },
    {
      title: 'Колекції',
      link: 'manage-collections'
    },
    {
      title: 'Витрати',
      link: 'manage-expenses'
    },
  ]

  currentUser: User | null = null;

  user$ = this.store.pipe(select(getCurrentUser), tap(user => this.currentUser = user));

  familyMembers$: Observable<FamilyMember[] | undefined> = this.store.pipe(select(getFamilyMembers));

  sampleRecommendedPortion = 250;

  constructor(private router: Router, private route: ActivatedRoute, private store: Store<IAppState>, private datamapping: DataMappingService) { }

  ngOnInit() {
  }

  @ViewChild(IonModal) settingsModal: IonModal | undefined;

  dismissSettingsModal() {
    this.settingsModal?.dismiss();
  }

  goSettings(link: string) {
    this.dismissSettingsModal();
    this.router.navigate([link], {relativeTo: this.route});
  }

  getProductText(id: string): string {
    return this.datamapping.getProductNameById(id);
  }

}
