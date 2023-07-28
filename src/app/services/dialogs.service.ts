import { Injectable } from '@angular/core';
import { ActionSheetController, ModalController, ToastController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { RecipyModalComponent } from '../shared/components/dialogs/recipy-modal/recipy-modal.component';

export interface ActionsheetButton {
  text: string;
  role: string;
  data: {
    action: string;
  };
}

export const ConfirmButton: ActionsheetButton = {
  text: 'Підтвердити',
  role: 'confirm',
  data: {
    action: 'confirm',
  },
};

export const CancelButton: ActionsheetButton = {
  text: 'Скасувати',
  role: 'cancel',
  data: {
    action: 'cancel',
  },
};

export enum ModalType {
  ViewRecipy,
  EditRecipy
}

@Injectable({
  providedIn: 'root',
})
export class DialogsService {
  constructor(private actionSheetCtrl: ActionSheetController, private toastController: ToastController, private modalCtrl: ModalController) {}

  async presentActionSheet(
    title: string,
    subHeader: string,
    buttons: ActionsheetButton[]
  ): Promise<OverlayEventDetail<ActionsheetButton>> {
    const actionSheet = await this.actionSheetCtrl.create({
      header: title,
      subHeader: subHeader,
      buttons: buttons,
    });

    await actionSheet.present();

    return await actionSheet.onDidDismiss<ActionsheetButton>();
  }

  openConfirmationDialog(
    title: string,
    subtitle: string
  ): Promise<OverlayEventDetail<ActionsheetButton>> {
    return this.presentActionSheet(title, subtitle, [
      ConfirmButton,
      CancelButton,
    ]);
  }

  //  example of use:
  //  opensheet(){
  //   this.dialog.openConfirmationDialog('confirm', 'this is irreversible').then(res => {
  //     console.log(res)
  //   })
  //     }

 async presentInfoToast(message: string){
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top'
    });

    await toast.present();
  }

  async presentInfoToastWithDismiss(message: string){
    const toast = await this.toastController.create({
      message: message,
      position: 'top',
      buttons: [
        {
          text: 'OK',
          role: 'info',
          handler: () => { toast.dismiss()}
        },
      ]
    });

    await toast.present();
  }

  async openModal(type: ModalType, data: any) {
    const modal = await this.modalCtrl.create({
      component: RecipyModalComponent,
      componentProps: {
        modalType: type,
        data
      },
      cssClass: 'recipy-modal'
    });
    modal.present();

    const { role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      
    }
  }
}
