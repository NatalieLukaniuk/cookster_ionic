import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { IonModal } from '@ionic/angular';
import { areSetsEqual } from 'src/app/shared/constants';

@Component({
    selector: 'app-add-group-modal',
    templateUrl: './add-group-modal.component.html',
    styleUrls: ['./add-group-modal.component.scss'],
    standalone: false
})
export class AddGroupModalComponent implements OnChanges {
  @Input() groups: Set<string> | undefined;
  @Input() ingredindex!: number;
  @Input() textTitle: string | undefined;
  @Input() preselectedGroup: string | undefined;
  @Output() onGroupSelected = new EventEmitter<string>();

  _groups: string[] = ['Основна страва'];
  selectedgroup: string = this._groups[0];

  addNewGroupOn = false;
  newGroup = '';

  @ViewChild(IonModal) modal: IonModal | undefined;

  cancel() {
    this.modal?.dismiss(null, 'cancel');
  }

  confirm() {
    this.onGroupSelected.emit(this.selectedgroup);
    this.modal?.dismiss();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['groups'].currentValue &&
      changes['groups'].currentValue.size &&
      !areSetsEqual(
        changes['groups'].currentValue,
        changes['groups'].previousValue
      )
    ) {
      if (this.groups?.size) {
        this._groups = Array.from(this.groups);
        this.selectedgroup = this._groups[0];
      } else {
        this._groups = ['Основна страва'];
      }
      if(this.preselectedGroup){
        this.selectedgroup = this.preselectedGroup
      } else {
        this.selectedgroup = this._groups[0];
      }
      
    }
  }

  onGroupName(event: string) {
    this._groups.push(event);
    this.selectedgroup = this._groups[this._groups.length - 1];
  }

  addGroup() {
    this._groups.push(this.newGroup);
    this.selectedgroup = this._groups[this._groups.length - 1];
    this.newGroup = '';
    this.addNewGroupOn = false;
  }
}
