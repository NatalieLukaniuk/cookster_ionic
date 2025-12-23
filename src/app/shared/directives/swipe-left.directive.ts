import { DialogsService } from './../../services/dialogs.service';
import {
  Directive,
  ElementRef,
  AfterViewInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { DomController, Gesture, GestureController } from '@ionic/angular';

@Directive({
    selector: '[swipeLeftDelete]',
    standalone: false
})
export class SwipeLeftDirective implements AfterViewInit {
  @Output() deleteItem = new EventEmitter<void>();
  windowWidth: number = 0;

  constructor(
    private gestureCtrl: GestureController,
    private el: ElementRef,
    private domCtrl: DomController,
    private dialog: DialogsService
  ) {
    const gesture: Gesture = this.gestureCtrl.create(
      {
        el: this.el.nativeElement,
        gestureName: 'swipe-left',
        threshold: 15,
        direction: 'x',
        onMove: (ev) => this.onMoveHandler(ev),
        onEnd: (ev) => {
          this.el.nativeElement.style.transition = '0.2s ease-out';

          // Fly out the element if we cross the threshold of 150px
          if (ev.deltaX < -150) {
            this.domCtrl.write(() => {
              this.el.nativeElement.style.transform = `translate3d(-${this.windowWidth}px, 0, 0)`;
            });
            this.dialog
              .openConfirmationDialog(
                `Видалити ${this.el.nativeElement.innerText}?`,
                'Ця дія незворотня'
              )
              .then((res) => {
                if (res.role === 'confirm') {
                  this.deleteItem.emit();
                } else {
                  this.revertChanges();
                }
              });
          } else {
            this.revertChanges();
          }
        },
      },
      true
    );
    gesture.enable();
  }
  ngAfterViewInit(): void {
    this.windowWidth = window.innerWidth;
  }
  onMoveHandler(ev: any) {
    const currentX = ev.deltaX;

    this.domCtrl.write(() => {
      // Make sure the item is above the other elements
      this.el.nativeElement.style.zIndex = 2;
      // Reposition the item
      this.el.nativeElement.style.transform = `translateX(${currentX}px)`;
    });
  }

  revertChanges() {
    this.domCtrl.write(() => {
      this.el.nativeElement.style.transform = '';
    });
  }
}
