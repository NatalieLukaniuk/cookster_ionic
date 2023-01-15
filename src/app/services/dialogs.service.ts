import { Injectable } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';

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

@Injectable({
  providedIn: 'root',
})
export class DialogsService {
  constructor(private actionSheetCtrl: ActionSheetController) {}

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
}
