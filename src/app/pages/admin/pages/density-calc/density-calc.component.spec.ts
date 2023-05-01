/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DensityCalcComponent } from './density-calc.component';

describe('DensityCalcComponent', () => {
  let component: DensityCalcComponent;
  let fixture: ComponentFixture<DensityCalcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DensityCalcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DensityCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
