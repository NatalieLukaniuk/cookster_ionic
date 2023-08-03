import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonModal } from '@ionic/angular';

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
    }
  ]

  constructor(private router: Router, private route: ActivatedRoute) { }

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

}
