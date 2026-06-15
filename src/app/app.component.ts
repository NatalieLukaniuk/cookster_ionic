import { DialogsService } from './services/dialogs.service';
import { DataMappingService } from './services/data-mapping.service';
import { getCurrentUser } from './store/selectors/user.selectors';
import { AuthService } from './services/auth.service';

import { Store, select } from '@ngrx/store';
import { Component, effect, inject, OnInit } from '@angular/core';
import * as RecipiesActions from './store/actions/recipies.actions';

import { combineLatest, take } from 'rxjs';
import { IAppState } from './store/reducers';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { Role } from './models/auth.models';
import { NavigationEnd, Router } from '@angular/router';
import { AngularDeviceInformationService } from 'angular-device-information';
import { ModalController } from '@ionic/angular';
import * as _ from 'lodash';
import { LoadCommentsAction } from './store/actions/comments.actions';
import { LayoutService } from './services/layout.service';
import { environment } from 'src/environments/environment';
import { UiService } from './services/ui.service';
import { ProductsService } from './services/products.service';
import { RecipiesService } from './services/recipies.service';

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

  uiService = inject(UiService);
  productsService = inject(ProductsService);
  recipiesService = inject(RecipiesService);

  $isLoading = this.uiService.getIsLoading;
  $isError = this.uiService.getIsError;
  $isSuccessMessage = this.uiService.getIsSuccessMessage;

  user$ = this.store.pipe(select(getCurrentUser));

  isAuthCheckComplete = false;
  isLoggedIn = false;

  Role = Role;

  $products = this.productsService.getProducts;
  $recipies = this.recipiesService.getRecipies;

  $isRecipiesLoaded = this.recipiesService.getIsRecipiesLoaded;
  $isProductsLoaded = this.productsService.getIsProductsLoaded;

  version = environment.version;

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
    private modalCtrl: ModalController,
    private layoutService: LayoutService,

  ) {
    effect(() => {
      const error = this.$isError()
      if (error?.length) {
        this.dialog.presentInfoToast(error);
        this.uiService.resetError()
      }
    })

    effect(() => {
      const successMessage = this.$isSuccessMessage();
      if (successMessage?.length) {
        this.dialog.presentInfoToast(successMessage);
        this.uiService.dismissSuccessMessage()
      }
    })
  }
  ngOnInit(): void {
    this.loadData();

    initializeApp(this.firebaseConfig);

    this.subscribeIsLoggedIn();



    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.uiService.setCurrentRoute(event.url);
      }
    })

    this.layoutService.trackOrientationChange();
  }

  loadData() {
    this.uiService.setIsLoadingTrue();
    this.store.dispatch(new LoadCommentsAction())

    combineLatest([
      this.productsService.loadProducts(),
      this.recipiesService.loadRecipies(),
    ]).subscribe(([products, recipies]) => {
      this.uiService.setIsLoadingFalse();
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
}
