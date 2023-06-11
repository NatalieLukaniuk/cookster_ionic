import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-controller-input-dialog',
  templateUrl: './controller-input-dialog.component.html',
  styleUrls: ['./controller-input-dialog.component.scss']
})
export class ControllerInputDialogComponent {
  @Input() inputFieldLabel!: string;
  @Input() inputType: string = 'string';

  result = '';

  presentingElement: Element | undefined | null;

  constructor(private modalCtrl: ModalController) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.result, 'confirm');
  }
}
