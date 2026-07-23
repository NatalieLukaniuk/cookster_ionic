import { Component, computed, inject, Input, signal } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ModalType } from 'src/app/services/dialogs.service';
import { RecipiesService } from 'src/app/services/recipies.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-recipy-modal',
  templateUrl: './recipy-modal.component.html',
  styleUrls: ['./recipy-modal.component.scss']
})
export class RecipyModalComponent {
   uiService = inject(UiService);
   recipiesService = inject(RecipiesService);

  @Input() modalType: ModalType = ModalType.ViewRecipy;

  ModalType = ModalType;

  @Input() data: any;

  $recipy = computed(() => {
    const foundOpenedRecipy = this.recipiesService.getRecipies().find((recipy) => recipy.id === this.data.recipyId);
    if(foundOpenedRecipy && foundOpenedRecipy.ingrediends){
      let updatedRecipy = {...foundOpenedRecipy};
      updatedRecipy.ingrediends.sort((a, b) => b.amount - a.amount);
      return updatedRecipy
    } else return null
  })

  isView = signal(this.modalType === ModalType.ViewRecipy)


  constructor(private modalCtrl: ModalController) { }

  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
}
