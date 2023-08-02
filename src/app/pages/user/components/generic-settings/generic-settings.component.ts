import { Component, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable, Subject, debounceTime, map, takeUntil, tap } from 'rxjs';
import { FamilyMember, Preferences } from 'src/app/models/auth.models';
import { INPUT_DEBOUNCE_TIME } from 'src/app/shared/constants';
import { UpdatePreferencesAction } from 'src/app/store/actions/user.actions';
import { IAppState } from 'src/app/store/reducers';
import { getFamilyMembers, getUserPreferences } from 'src/app/store/selectors/user.selectors';

@Component({
  selector: 'app-generic-settings',
  templateUrl: './generic-settings.component.html',
  styleUrls: ['./generic-settings.component.scss']
})
export class GenericSettingsComponent implements OnDestroy {

  defaultPrefs: Preferences = {
    isUsePersonalizedPortionSize: false,
    isUseRecommendedPortionSize: false,
    defaultPortionSize: 250,
    noShowProducts: []
  }

  preferences!: Preferences;

  defaultPortionSize = '';

  defaultPortionSize$ = new Subject<number>();

  destroy$ = new Subject<void>();

  familyMembers: FamilyMember[] = [];

  familyMembers$ = this.store.pipe(select(getFamilyMembers), tap(res => {
    if (res) {
      this.familyMembers = _.cloneDeep(res);
    }
  }));

  preferences$ = this.store.pipe(select(getUserPreferences), map(prefs => {
    if (prefs) {
      this.preferences = _.cloneDeep(prefs);
      this.defaultPortionSize = prefs.defaultPortionSize.toString();
    }

    return prefs ? prefs : this.defaultPrefs
  }))

  isEditDefaultPortionEnabled$: Observable<boolean> = this.store.pipe(
    select(getUserPreferences),
    map(prefs => !prefs?.isUseRecommendedPortionSize && !prefs?.isUsePersonalizedPortionSize))

  isUseIndividualPortionsEnabled$ = this.familyMembers$.pipe(map(familyMembers => familyMembers?.every(member => !!member.portionSizePercentage)));

  constructor(private store: Store<IAppState>) {
    this.updateDefaultPortionSize();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  changeDefaultPortionSize(event: string) {
    this.defaultPortionSize$.next(+event)
  }

  updateDefaultPortionSize() {
    this.defaultPortionSize$.pipe(debounceTime(INPUT_DEBOUNCE_TIME), takeUntil(this.destroy$)).subscribe(defaultPortion => {
      this.preferences = {
        ...this.preferences,
        defaultPortionSize: defaultPortion
      };
      this.updatePreferences();
    })
  }

  updatePreferences() {
    this.store.dispatch(new UpdatePreferencesAction(this.preferences))
  }

  onToggled(key: keyof Preferences, event: any) {
    this.preferences = {
      ...this.preferences,
      [key]: event.detail.checked
    }
    if (key === 'isUsePersonalizedPortionSize' && this.preferences.isUseRecommendedPortionSize) {
      this.preferences.isUseRecommendedPortionSize = false;
    }
    if (key === 'isUseRecommendedPortionSize' && this.preferences.isUsePersonalizedPortionSize) {
      this.preferences.isUsePersonalizedPortionSize = false;
    }
    this.updatePreferences();
  }

}
