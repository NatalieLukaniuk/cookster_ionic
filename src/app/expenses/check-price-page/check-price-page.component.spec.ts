import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckPricePageComponent } from './check-price-page.component';

describe('CheckPricePageComponent', () => {
  let component: CheckPricePageComponent;
  let fixture: ComponentFixture<CheckPricePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckPricePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckPricePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
