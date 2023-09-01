import { DialogsService } from './services/dialogs.service';
import { DataMappingService } from './services/data-mapping.service';
import { getCurrentUser } from './store/selectors/user.selectors';
import { AuthService } from './services/auth.service';
import {
  getIsError,
  getIsLoading,
  getIsSuccessMessage,
} from './store/selectors/ui.selectors';
import {
  getAllProducts,
  getAllRecipies,
} from './store/selectors/recipies.selectors';
import { Store, select } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import * as RecipiesActions from './store/actions/recipies.actions';
import * as UiActions from './store/actions/ui.actions';
import { combineLatest, take } from 'rxjs';
import { IAppState } from './store/reducers';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { Role } from './models/auth.models';
import { NavigationEnd, Router } from '@angular/router';
import { AngularDeviceInformationService } from 'angular-device-information';
import { ModalController } from '@ionic/angular';
import { AddReminderModalComponent } from './shared/components/dialogs/add-reminder-modal/add-reminder-modal.component';
import { Reminder } from './models/calendar.models';
import * as _ from 'lodash';
import { UpdateUserAction } from './store/actions/user.actions';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  firebaseConfig = {
    apiKey: 'AIzaSyAYe2tCdCuYoEPi0grZ1PkHTHgScw19LpA',
    authDomain: 'cookster-12ac8.firebaseapp.com',
    databaseURL: 'https://cookster-12ac8-default-rtdb.firebaseio.com',
    projectId: 'cookster-12ac8',
    storageBucket: 'gs://cookster-12ac8.appspot.com/',
    messagingSenderId: '755799855022',
    appId: '1:755799855022:web:69a08acd3c948e72cf023f',
  };

  isLoading$ = this.store.pipe(select(getIsLoading));
  user$ = this.store.pipe(select(getCurrentUser));

  isAuthCheckComplete = false;
  isLoggedIn = false;

  Role = Role;

  products$ = this.store.pipe(select(getAllProducts));
  recipies$ = this.store.pipe(select(getAllRecipies));

  adminPages = [
    { name: 'Рецепти', path: `recipies` },
    { name: 'Продукти', path: 'products' },
    { name: 'Редагування продуктів', path: 'update-products' },
    { name: 'Коментарі до рецептів', path: 'recipies-comments' },
    { name: 'Додати продукт', path: 'add-product' },
    { name: 'Калькулятор щільності', path: 'density-calculator' },
  ];

  constructor(
    private store: Store<IAppState>,
    private authService: AuthService,
    private dataMappingService: DataMappingService,
    private dialog: DialogsService,
    private router: Router,
    private deviceInformationService: AngularDeviceInformationService,
    private modalCtrl: ModalController
  ) { }
  ngOnInit(): void {
    this.loadData();

    initializeApp(this.firebaseConfig);

    this.subscribeIsLoggedIn();

    this.store.pipe(select(getIsError)).subscribe((res) => {
      if (res) {
        this.dialog.presentInfoToast(res);
        this.store.dispatch(new UiActions.ResetErrorAction());
      }
    });

    this.store.pipe(select(getIsSuccessMessage)).subscribe((res) => {
      if (res) {
        this.dialog.presentInfoToast(res);
        this.store.dispatch(new UiActions.DismissSuccessMessageAction());
      }
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.store.dispatch(new UiActions.SetCurrentRouteAction(event.url));

        let root = document.documentElement;
        if (this.deviceInformationService.isDesktop()) {
          if (event.url.includes('admin')) {
            root.style.setProperty('--app-width', 100 + "vw");
          } else {
            root.style.setProperty('--app-width', 900 + "px");
          }
        }

      }
    })



  }

  loadData() {
    this.store.dispatch(new UiActions.SetIsLoadingAction());
    this.store.dispatch(new RecipiesActions.GetRecipiesAction());
    this.store.dispatch(new RecipiesActions.GetProductsAction());

    combineLatest([
      this.products$,
      this.recipies$,
    ]).subscribe((res) => {
      let [products, recipies] = res;
      if (products.length) {
        this.dataMappingService.products$.next(products);
      }
      if (products.length && recipies.length) {
        this.store.dispatch(new UiActions.SetIsLoadingFalseAction());
      }
    });
  }

  subscribeIsLoggedIn() {
    getAuth().onAuthStateChanged((user: { email: any; uid: any } | null) => {
      this.isAuthCheckComplete = true;
      this.isLoggedIn = !!user;
      if (user) {
        this.authService.processIsLoggedIn(user);
      } else {
        this.authService.processIsNotLoggedIn();
      }
    });
  }

  logout() {
    this.authService.logoutUser();
  }

  async onAddReminder(){
    const modal = await this.modalCtrl.create({
      component: AddReminderModalComponent,
      breakpoints: [0.5, 0.75],
      initialBreakpoint: 0.5
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {

      const reminder: Reminder = {
        description: data.description,
        calendarDay: data.date,
        fullDate: data.fullDate,
        done: false
      }
      
      this.user$.pipe(take(1)).subscribe(user => {
        if(user){
          const updatedUser = _.cloneDeep(user);
          if(updatedUser.savedPreps){
            updatedUser.savedPreps.push(reminder)
          } else {
            updatedUser.savedPreps = [reminder];
          }
          this.store.dispatch(new UpdateUserAction(updatedUser, 'Нагадування додано'))
        }
      })
    }
  }
}
