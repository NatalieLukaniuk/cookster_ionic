import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-controller-input-dialog',
  templateUrl: './controller-input-dialog.component.html',
  styleUrls: ['./controller-input-dialog.component.scss']
})
export class ControllerInputDialogComponent implements OnInit {
  inputFieldLabel!: string;
  inputType: string = 'string';
  fillValue: string = '';

  result = '';

  presentingElement: Element | undefined | null;

  constructor(private modalCtrl: ModalController) {}
  ngOnInit(): void {
    if(this.fillValue){
      this.result = this.fillValue;
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.result, 'confirm');
  }
}
