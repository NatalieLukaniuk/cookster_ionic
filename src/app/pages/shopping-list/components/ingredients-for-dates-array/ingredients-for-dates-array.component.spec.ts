import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientsForDatesArrayComponent } from './ingredients-for-dates-array.component';

describe('IngredientsForDatesArrayComponent', () => {
  let component: IngredientsForDatesArrayComponent;
  let fixture: ComponentFixture<IngredientsForDatesArrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngredientsForDatesArrayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientsForDatesArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
