/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdvancePreparationComponent } from './advance-preparation.component';

describe('AdvancePreparationComponent', () => {
  let component: AdvancePreparationComponent;
  let fixture: ComponentFixture<AdvancePreparationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancePreparationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancePreparationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
