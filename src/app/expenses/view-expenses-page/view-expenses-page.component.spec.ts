import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExpensesPageComponent } from './view-expenses-page.component';

describe('ViewExpensesPageComponent', () => {
  let component: ViewExpensesPageComponent;
  let fixture: ComponentFixture<ViewExpensesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewExpensesPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewExpensesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
