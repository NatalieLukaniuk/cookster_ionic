import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostOfRecipyComponent } from './cost-of-recipy.component';

describe('CostOfRecipyComponent', () => {
  let component: CostOfRecipyComponent;
  let fixture: ComponentFixture<CostOfRecipyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostOfRecipyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostOfRecipyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
