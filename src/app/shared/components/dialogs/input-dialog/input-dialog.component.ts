import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-input-dialog',
  templateUrl: './input-dialog.component.html',
  styleUrls: ['./input-dialog.component.scss'],
})
export class InputDialogComponent implements OnInit {
  @Input() id!: string;
  @Input() buttonText: string = 'open'
  @Input() inputFieldLabel!: string;
  @Input() inputType: string = 'string';

  @Output() resultReceived = new EventEmitter<string>();

  result = '';

  presentingElement: Element | undefined | null;

  constructor() {}

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
  }

  onDismissed() {
    this.resultReceived.emit(this.result);
  }
}
