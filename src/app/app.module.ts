import { FiltersModule } from './filters/filters.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarEffects } from './store/effects/calendar.effects';
import { PlannerEffects } from './store/effects/planner.effects';
import { RecipiesEffects } from './store/effects/recipies.effects';
import { UserEffects } from './store/effects/user.effects';
import { reducers } from './store/reducers';
import { AngularDeviceInformationService } from 'angular-device-information';
import { CommentsEffects } from './store/effects/comments.effects';
import { ExpensesEffects } from './store/effects/expenses.effects';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([
      RecipiesEffects,
      UserEffects,
      CalendarEffects,
      PlannerEffects,
      CommentsEffects,
      ExpensesEffects
    ]),
    StoreDevtoolsModule.instrument({ 
      maxAge: 25,
      logOnly: environment.production,
    }),
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, AngularDeviceInformationService],
  bootstrap: [AppComponent],
})
export class AppModule {}
