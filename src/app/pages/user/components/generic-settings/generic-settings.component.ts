import { Component, computed, effect, inject, OnDestroy, signal } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable, Subject, debounceTime, map, takeUntil, tap } from 'rxjs';
import { FamilyMember, Preferences, defaultPrefs } from 'src/app/models/auth.models';
import { UserDataService } from 'src/app/services/user-data.service';
import { INPUT_DEBOUNCE_TIME } from 'src/app/shared/constants';
import { IAppState } from 'src/app/store/reducers';

@Component({
  selector: 'app-generic-settings',
  templateUrl: './generic-settings.component.html',
  styleUrls: ['./generic-settings.component.scss']
})
export class GenericSettingsComponent implements OnDestroy {
  userDataService = inject(UserDataService);

  preferences = signal<Preferences>(defaultPrefs);

  defaultPortionSize = '';

  defaultPortionSize$ = new Subject<number>();

  destroy$ = new Subject<void>();


  $userFamily = this.userDataService.userFamily;
  $savedPreferences = this.userDataService.userPreferences;

  $isEditDefaultPortionEnabled = computed(() =>
    !this.$savedPreferences()?.isUseRecommendedPortionSize &&
    !this.$savedPreferences()?.isUsePersonalizedPortionSize)

  $isUseIndividualPortionsEnabled = computed(() =>
    this.$userFamily().every(member => !!member.portionSizePercentage))




  constructor(private store: Store<IAppState>) {
    effect(() => {
      const prefs = this.$savedPreferences();
      if (prefs) {
        this.preferences.set(prefs);
        this.defaultPortionSize = prefs.defaultPortionSize.toString();
      }
    }, { allowSignalWrites: true })
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
      this.preferences.update(current => {
        if (!current) return current;
        return {
          ...current,
          defaultPortionSize: defaultPortion
        }
      })

      this.updatePreferences();
    })
  }

  updatePreferences() {
    this.userDataService.updatePreferences(this.preferences())
  }

  onToggled(key: keyof Preferences, event: any) {
    let valueToSet = event.detail.checked;

    if (key === 'isUsePersonalizedPortionSize' && this.preferences().isUseRecommendedPortionSize) {
      valueToSet = false;
    }
    if (key === 'isUseRecommendedPortionSize' && this.preferences().isUsePersonalizedPortionSize) {
      valueToSet = false;
    }

    this.preferences.update(current => {
      if (!current) return current;
      return {
        ...current,
        [key]: valueToSet
      }
    })


    this.updatePreferences();
  }

}
