import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReminderModalComponent } from './add-reminder-modal.component';

describe('AddReminderModalComponent', () => {
  let component: AddReminderModalComponent;
  let fixture: ComponentFixture<AddReminderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddReminderModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddReminderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
