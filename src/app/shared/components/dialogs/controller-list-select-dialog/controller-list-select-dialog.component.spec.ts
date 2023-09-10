import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerListSelectDialogComponent } from './controller-list-select-dialog.component';

describe('ControllerListSelectDialogComponent', () => {
  let component: ControllerListSelectDialogComponent;
  let fixture: ComponentFixture<ControllerListSelectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControllerListSelectDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControllerListSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
