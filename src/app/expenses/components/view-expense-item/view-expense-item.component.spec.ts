import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExpenseItemComponent } from './view-expense-item.component';

describe('ViewExpenseItemComponent', () => {
  let component: ViewExpenseItemComponent;
  let fixture: ComponentFixture<ViewExpenseItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewExpenseItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewExpenseItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
