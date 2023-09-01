import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveRecipyModalComponent } from './move-recipy-modal.component';

describe('MoveRecipyModalComponent', () => {
  let component: MoveRecipyModalComponent;
  let fixture: ComponentFixture<MoveRecipyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveRecipyModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoveRecipyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
