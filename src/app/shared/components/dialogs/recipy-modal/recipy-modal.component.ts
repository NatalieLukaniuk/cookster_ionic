import { Component, inject, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { filter, tap, map } from 'rxjs';
import { ModalType } from 'src/app/services/dialogs.service';
import { UiService } from 'src/app/services/ui.service';
import { IAppState } from 'src/app/store/reducers';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

@Component({
  selector: 'app-recipy-modal',
  templateUrl: './recipy-modal.component.html',
  styleUrls: ['./recipy-modal.component.scss']
})
export class RecipyModalComponent {
   uiService = inject(UiService);
  @Input() modalType: ModalType = ModalType.ViewRecipy;

  ModalType = ModalType;

  @Input() data: any;

  recipy$ = this.store.pipe(
    select(getAllRecipies),
    filter((res) => !!res.length),
    tap(() => this.uiService.setIsLoadingTrue()),
    map((res) => res.find((recipy) => recipy.id === this.data.recipyId)),
    map((recipy) => {
      if (recipy && recipy.ingrediends) {
        let updatedRecipy = _.cloneDeep(recipy);
        updatedRecipy.ingrediends.sort((a, b) => b.amount - a.amount);
        this.uiService.setIsLoadingFalse();
        return updatedRecipy;
      } else return recipy;
    })
  );

  user$ = this.store.pipe(select(getCurrentUser));

  constructor(private modalCtrl: ModalController, private store: Store<IAppState>) { }

  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  isView(){
    return this.modalType === ModalType.ViewRecipy;
  }
}
