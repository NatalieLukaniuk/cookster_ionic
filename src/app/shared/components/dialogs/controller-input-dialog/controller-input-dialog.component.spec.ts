import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerInputDialogComponent } from './controller-input-dialog.component';

describe('ControllerInputDialogComponent', () => {
  let component: ControllerInputDialogComponent;
  let fixture: ComponentFixture<ControllerInputDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControllerInputDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControllerInputDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
