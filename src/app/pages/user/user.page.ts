import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { tap } from 'rxjs';
import { User } from 'src/app/models/auth.models';
import { IAppState } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

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

  currentUser: User | null = null;

  user$ = this.store.pipe(select(getCurrentUser), tap(user => this.currentUser = user));

  constructor(private router: Router, private route: ActivatedRoute, private store: Store<IAppState>) { }

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
