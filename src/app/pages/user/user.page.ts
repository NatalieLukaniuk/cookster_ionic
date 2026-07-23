import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonModal } from '@ionic/angular';

import { DataMappingService } from 'src/app/services/data-mapping.service';
import { UserDataService } from 'src/app/services/user-data.service';


enum ProfileTabs {
  FamilyMembers,
  HiddenRecipies
}
@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage {
  userDataService = inject(UserDataService);

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

  $isLoggedIn = this.userDataService.isUserLoggedIn;
  $familyMembers = this.userDataService.userFamily;
  $userEmail = this.userDataService.userEmail;

  sampleRecommendedPortion = 250;

  currentPage: ProfileTabs = ProfileTabs.FamilyMembers;
  ProfileTabs = ProfileTabs

  constructor(private router: Router, private route: ActivatedRoute, private datamapping: DataMappingService) { }

  @ViewChild(IonModal) settingsModal: IonModal | undefined;

  dismissSettingsModal() {
    this.settingsModal?.dismiss();
  }

  goSettings(link: string) {
    this.dismissSettingsModal();
    this.router.navigate([link], { relativeTo: this.route });
  }

  getProductText(id: string): string {
    return this.datamapping.getProductNameById(id);
  }

}
