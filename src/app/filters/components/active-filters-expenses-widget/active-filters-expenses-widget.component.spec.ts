import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveFiltersExpensesWidgetComponent } from './active-filters-expenses-widget.component';

describe('ActiveFiltersExpensesWidgetComponent', () => {
  let component: ActiveFiltersExpensesWidgetComponent;
  let fixture: ComponentFixture<ActiveFiltersExpensesWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveFiltersExpensesWidgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveFiltersExpensesWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
