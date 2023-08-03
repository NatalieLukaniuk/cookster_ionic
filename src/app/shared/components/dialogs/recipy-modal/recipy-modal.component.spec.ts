import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipyModalComponent } from './recipy-modal.component';

describe('RecipyModalComponent', () => {
  let component: RecipyModalComponent;
  let fixture: ComponentFixture<RecipyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipyModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
