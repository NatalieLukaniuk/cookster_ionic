import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-multiple-dates-picker-modal',
  templateUrl: './multiple-dates-picker-modal.component.html',
  styleUrls: ['./multiple-dates-picker-modal.component.scss'],
})
export class MultipleDatesPickerModalComponent {
@Output() datesSelected = new EventEmitter<string[]>();

  @ViewChild(IonModal) modal: IonModal | undefined;
  
    selectedDates: [] = [];
    selectedDateChanged(event: any) {
      this.selectedDates = event.detail.value;
    }
  
    cancel() {
      this.modal?.dismiss(null, 'cancel');
    }
  
    confirm() {
      this.modal?.dismiss(this.selectedDates, 'confirm');
    }
  
    onWillDismiss(event: Event) {
      const ev = event as CustomEvent<OverlayEventDetail<string[]>>;
      if (ev.detail.role === 'confirm' && ev.detail.data) {
        this.datesSelected.emit(ev.detail.data)
      }
    }

}
