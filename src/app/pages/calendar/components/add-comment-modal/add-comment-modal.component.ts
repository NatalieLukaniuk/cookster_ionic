import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { MealTime } from 'src/app/models/calendar.models';

@Component({
  selector: 'app-add-comment-modal',
  templateUrl: './add-comment-modal.component.html',
  styleUrls: ['./add-comment-modal.component.scss']
})
export class AddCommentModalComponent {
  @Input() meatime!: MealTime;
  @Input() date!: string;
  @Output() commentToAdd = new EventEmitter<string>();

  comment = '';

  @ViewChild(IonModal) modal: IonModal | undefined;

  cancel() {
    this.modal?.dismiss(null, 'cancel');
  }

  get isValid(){
    return !!this.comment.length;
  }

  confirm(){
    this.modal?.dismiss(this.comment, 'confirm');
    this.commentToAdd.emit(this.comment);
  }
}
