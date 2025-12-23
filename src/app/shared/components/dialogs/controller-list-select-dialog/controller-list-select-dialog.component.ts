import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-controller-list-select-dialog',
  templateUrl: './controller-list-select-dialog.component.html',
  styleUrls: ['./controller-list-select-dialog.component.scss']
})
export class ControllerListSelectDialogComponent {
  list: string[] = [];
  selected: string = '';

  presentingElement: Element | undefined | null;

  constructor(private modalCtrl: ModalController) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.selected, 'confirm');
  }
}
